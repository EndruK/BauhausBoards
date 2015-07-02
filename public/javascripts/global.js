var pos = 'index';
var sideBarTimeout = 5000; //sidebar timeout in ms
var sidebarTimeoutHandler;
//###DOM#######################################
$('.sidebar').on('click', '.btnUser', loadMain);
$('.sidebar').on('click', '#btnMessage', loadMessageLanding);
$('.sidebar').on('click', '#btnBackend', loadBackend);
$('.sidebar').on('click', '.btnBack', loadMain)
$('.sidebarSwiper').swipe({
  swipeStatus:function(event,phase,direction,distance,duration,fingers) {
    //console.log(direction);
    if(phase=='move' && direction=="right") {
      openSidebar();
      return false;
    }
    if(phase=='move' && direction=='left') {
      closeSidebar();
      return false;
    }
  }
});

//###FUNCTIONS#################################
function loadMain(event) {
  //closeSidebar();
  showSidebar('sidebarMain');
  console.log('goTo: main page');
  $('#header').text('header');
}
function loadMessageLanding(event) {
  closeSidebar();
  console.log('goTo: message landing');
  $('#header').text('Message Landingpage');
  //TODO: change the sidebar to the create Message sidebar
}
function loadBackend(event) {
  $('#header').text('Backend');
  showSidebar('sidebarBackend');
  updateTimer();
  //$('#sidebarMain').css('visibility', 'hidden');
  //$('#sidebarBackend').css('visibility', 'visible');
}

function openSidebar(){
  updateTimer();
  $('.sidebar').removeClass('close-sidebar');
  $('.sidebar').addClass("open-sidebar");
};
function closeSidebar() {
  $('.sidebar').removeClass('open-sidebar');
  $('.sidebar').addClass("close-sidebar");
  clearTimeout(sidebarTimeoutHandler);
}

function showSidebar(sidebar) {
  switch(sidebar){
    case 'sidebarMain':
      //all contents
      $('#sidebarMain').css('visibility', 'visible');
      $('#sidebarBackend').css('visibility', 'hidden');
      break;
    case 'sidebarBackend':
      $('#sidebarMain').css('visibility', 'hidden');
      $('#sidebarBackend').css('visibility', 'visible');
    default:
      //nothing or main???
      break;
  };
}
function updateTimer() {
  clearTimeout(sidebarTimeoutHandler);
  sidebarTimeoutHandler = setTimeout(closeSidebar, sideBarTimeout);
}