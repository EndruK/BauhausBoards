//set up the global paper scope
paper.install(window);
var pos = 'index';
var sideBarTimeout = 10000; //sidebar timeout in ms
var sidebarTimeoutHandler;
var sidebarStatus = false;
var boardID = null;

//###DOM########################################################################
//$('.sidebar').on('click', '.btnUser', loadMain);
$('.sidebar').on('click', '.btnMessage', loadMessageLanding);
$('.sidebar').on('click', '.btnBackend', loadBackend);
$('.sidebar').on('click', '.btnBack', loadMain);
//$('.sidebar').on('click', '.btnBackendSettings', loadSettings);
$('.sidebar').on('click', '.btnCreateMessage', loadCreateMessage);
$('.sidebar').on('click', '.btnFeedback', loadFeedback);
$('.sidebar').on('click', '.btnSetStatus', loadChangeStatus);
$('.sidebar').on('click', '.btnChangeContent', loadChangeContent);
$('.sidebar').on('click', '.btnViewMessages', loadViewMessages);
$('.sidebar').on('click', '.btnUserSettings', loadUserSettings);
//$('.sidebar').on('click', '.btnRoomSettings', loadRoomSettings);
//$('.sidebar').on('click', '.btnLogs', loadLogs);

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
$('.sidebarSwiper').click(function(){
  console.log("clicked on sidebarSwiper");
  if(!sidebarStatus) {
    openSidebar();
  }
  else {
    closeSidebar();
  }
  return false;
});

//###FUNCTIONS##################################################################
function loadMain(event) {
  usercollection = new Array();
  $("#header").empty();
  project.clear();
  $("#sidebarMain .sidebarUpper").empty();
  removeAllGifs();
  loadBoard();
  showSidebar('sidebarMain');
  console.log('goTo: main page');
  $('#header').text('header');
  if(usercollection.length > 0) {
    showUser(usercollection[0].id);
  }
  $('#EditorCanvas').css('visibility','visible');
  $('#tabletSizePreview').css('visibility','visible');
  show_gifs();
  addGifTicker();
  startSwitchUserTimer();
}
function loadMessageLanding(event) {
  showSidebar('sidebarMessages');
  console.log('goTo: message landing');
  $('#header').text('Message Landingpage');
  updateTimer();
}
function loadCreateMessage(event) {
  var tmp  = $('#header').text('Compose Message\nall selected persons have to be displayed here');
  undo_undoStack = FixedQueue(undo_stackLength);
  undo_redoStack = FixedQueue(undo_stackLength);
  tmp.html(tmp.html().replace(/\n/g,'<br>'));
  paper.setup('EditorCanvas');
  activatePenTool();
  activeColor = colors["black"];
  showSidebar('sidebarCreateMessage');
  clearTimeout(5000);
  updateTimer();
  addImageDropLayer();
  show_gifs();
  removeAllGifs();
  $('#tabletSizePreview').css('visibility','visible');
}
function loadBackend(event) {
  $('#header').text('Backend');
  showSidebar('sidebarBackend');
  updateTimer();
}
/*function loadSettings(event) {
  $('#header').text('Settings');
  showSidebar('sidebarSettings');
  updateTimer();
}*/
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
  showSidebar('sidebarUserSettings');
  $('#users').css('visibility','visible');
  loadUser();
  updateTimer();
}
/*
function loadRoomSettings(event) {
  $('#header').text('Room Settings');
  showSidebar('loadRoomSettings');
  $('#settings').css('visibility','visible');
  loadRooms();
  updateTimer();
}
function loadLogs(event) {
  $('#header').text('Logs');
  showSidebar('loadLogs');
  updateTimer();
}*/

function openSidebar(){
  updateTimer();
  sidebarStatus = true;
  $('.sidebar').removeClass('close-sidebar');
  $('.sidebar').addClass("open-sidebar");
};
function closeSidebar() {
  sidebarStatus = false;
  $('.sidebar').removeClass('open-sidebar');
  $('.sidebar').addClass("close-sidebar");
  clearTimeout(sidebarTimeoutHandler);
}

function showSidebar(sidebar) {
  switch(sidebar){
    case 'sidebarMain':
      hideAll();
      $('#sidebarMain').css('visibility', 'visible');
      $('#myCanvas').css('visibility','visible');
      break;
    case 'sidebarBackend':
      hideAll();
      $('#sidebarBackend').css('visibility', 'visible');
      $('#myCanvas').css('visibility','hidden');
      break;
    case 'sidebarMessages':
      hideAll();
      $('#sidebarMessages').css('visibility', 'visible');
      break;
    case 'sidebarUserSettings':
      hideAll();
      $('#sidebarUserSettings').css('visibility','visible');
      break;
    case 'sidebarCreateMessage':
      hideAll();
      $('#sidebarCreateMessage').css('visibility','visible');
      $('#EditorCanvas').css('visibility','visible');
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
    /*case 'loadUserSettings':
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
      break;*/
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
  //$('#sidebarBackendSettings').css('visibility', 'hidden');
  $('#sidebarCreateMessage').css('visibility','hidden');
  $('#sidebarFeedback').css('visibility','hidden');
  $('#sidebarChangeStatus').css('visibility','hidden');
  $('#sidebarChangeContent').css('visibility','hidden');
  $('#sidebarViewMessages').css('visibility','hidden');
  $('#sidebarUserSettings').css('visibility','hidden');
  //$('#sidebarBackendRoomSettings').css('visibility','hidden');
  //$('#sidebarBackendLogs').css('visibility','hidden');
  $('#EditorCanvas').css('visibility','hidden');
  //$('#settings').css('visibility','hidden');
  //$('#users').css('visibility','hidden');
  $('#tabletSizePreview').css('visibility','hidden');
  closeContainer();
  closeColorContainer();
  resetColor();
  resetStrokeSize();
  removeImageDropLayer();
  removeAllGifs();
  hide_gifs();
  stopSwitchUserTimer();
  removeListeners();
}

function showPopup() {
  popupVisible = true;
  $("body").append("<div id='popupBackground1' class='popupBackground'>");
  $("body").append("<div id='popup'>");
  $("#popupBackground1").on("click",removePopup);
  $("#popup").css({
    "left": $(window).width()/2 - $("#popup").width()/2 + "px"
  });
}

function removePopup() {
  popupVisible = false;
  $("#popupBackground1").remove();
  $("#popup").remove();
}