var pos = 'index';
var sideBarTimeout = 10000; //sidebar timeout in ms
var sidebarTimeoutHandler;
//###DOM#######################################
$('.sidebar').on('click', '.btnUser', loadMain);
$('.sidebar').on('click', '.btnMessage', loadMessageLanding);
$('.sidebar').on('click', '.btnBackend', loadBackend);
$('.sidebar').on('click', '.btnBack', loadMain);
$('.sidebar').on('click', '.btnBackendSettings', loadSettings);
$('.sidebar').on('click', '.btnCreateMessage', loadCreateMessage);
$('.sidebar').on('click', '.btnFeedback', loadFeedback);
$('.sidebar').on('click', '.btnSetStatus', loadChangeStatus);
$('.sidebar').on('click', '.btnChangeContent', loadChangeContent);
$('.sidebar').on('click', '.btnViewMessages', loadViewMessages);
$('.sidebar').on('click', '.btnUserSettings', loadUserSettings);
$('.sidebar').on('click', '.btnRoomSettings', loadRoomSettings);
$('.sidebar').on('click', '.btnLogs', loadLogs);


$('.sidebar').on('click', '.test', test);


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
  showSidebar('sidebarMain');
  console.log('goTo: main page');
  $('#header').text('header');
}
function loadMessageLanding(event) {
  showSidebar('sidebarMessages');
  console.log('goTo: message landing');
  $('#header').text('Message Landingpage');
  updateTimer();
}
function loadBackend(event) {
  $('#header').text('Backend');
  showSidebar('sidebarBackend');
  updateTimer();
}
function loadSettings(event) {
  $('#header').text('Settings');
  showSidebar('sidebarSettings');
  updateTimer();
}
function loadCreateMessage(event) {
  $('#header').text('Compose Message');
  showSidebar('sidebarCreateMessage');
  updateTimer();
}
function loadFeedback(event) {
  $('#header').text('Feedback');
  showSidebar('sidebarFeedback');
  updateTimer();
}
function loadChangeStatus(event) {
  $('#header').text('change Status');
  showSidebar('sidebarChangeStatus');
  updateTimer();
}
function loadChangeContent(event) {
  $('#header').text('change Content');
  showSidebar('sidebarChangeContent');
  updateTimer();
}
function loadViewMessages(event) {
  $('#header').text('View Messages');
  showSidebar('sidebarViewMessages');
  updateTimer();
}
function loadUserSettings(event) {
  $('#header').text('User Settings');
  showSidebar('loadUserSettings');
  updateTimer();
}
function loadRoomSettings(event) {
  $('#header').text('Room Settings');
  showSidebar('loadRoomSettings');
  updateTimer();
}
function loadLogs(event) {
  $('#header').text('Logs');
  showSidebar('loadLogs');
  updateTimer();
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
      hideAll();
      $('#sidebarMain').css('visibility', 'visible');
      break;
    case 'sidebarBackend':
      hideAll();
      $('#sidebarBackend').css('visibility', 'visible');
      break;
    case 'sidebarMessages':
      hideAll();
      $('#sidebarMessages').css('visibility', 'visible');
      break;
    case 'sidebarSettings':
      hideAll();
      $('#sidebarBackendSettings').css('visibility','visible');
      break;
    case 'sidebarCreateMessage':
      hideAll();
      $('#sidebarCreateMessage').css('visibility','visible');
      break;
    case 'sidebarFeedback':
      hideAll();
      $('#sidebarFeedback').css('visibility','visible');
      break;
    case 'sidebarChangeStatus':
      hideAll();
      $('#sidebarChangeStatus').css('visibility','visible');
      break;
    case 'sidebarChangeContent':
      hideAll();
      $('#sidebarChangeContent').css('visibility','visible');
      break;
    case 'sidebarViewMessages':
      hideAll();
      $('#sidebarViewMessages').css('visibility','visible');
      break;
    case 'loadUserSettings':
      hideAll();
      $('#sidebarBackendUserSettings').css('visibility','visible');
      break;
    case 'loadRoomSettings':
      hideAll();
      $('#sidebarBackendRoomSettings').css('visibility','visible');
      break;
    case 'loadLogs':
      hideAll();
      $('#sidebarBackendLogs').css('visibility','visible');
      break;
    default:
      //nothing or main???
      break;
  };
}
function updateTimer() {
  clearTimeout(sidebarTimeoutHandler);
  sidebarTimeoutHandler = setTimeout(closeSidebar, sideBarTimeout);
}
function hideAll() {
  $('#sidebarMain').css('visibility', 'hidden');
  $('#sidebarBackend').css('visibility', 'hidden');
  $('#sidebarMessages').css('visibility', 'hidden');
  $('#sidebarBackendSettings').css('visibility', 'hidden');
  $('#sidebarCreateMessage').css('visibility','hidden');
  $('#sidebarFeedback').css('visibility','hidden');
  $('#sidebarChangeStatus').css('visibility','hidden');
  $('#sidebarChangeContent').css('visibility','hidden');
  $('#sidebarViewMessages').css('visibility','hidden');
  $('#sidebarBackendUserSettings').css('visibility','hidden');
  $('#sidebarBackendRoomSettings').css('visibility','hidden');
  $('#sidebarBackendLogs').css('visibility','hidden');
}
function test() {
  console.log("drawing test");
  var canvas = document.getElementById('myCanvas');
  paper.setup(canvas);
  var path = new paper.Path();
  path.strokeColor = 'black';
  var start = new paper.Point(100,100);
  path.moveTo(start);
  path.lineTo(start.add([ 200, -50 ]));
  paper.view.draw();
}