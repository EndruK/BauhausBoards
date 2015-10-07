//set up the global paper scope
paper.install(window);
var pos = 'index';
var sideBarTimeout = 10000; //sidebar timeout in ms
var sidebarTimeoutHandler;
var reloadPageTimeout;
var reloadPageTime = 1000*60*60*2 //2h
var sidebarStatus = false;
var boardID = null;
var roomID = null;
var floatyTimer = null;
var floatyTime = 5000;

//###DOM########################################################################
$('.sidebar').on('click', '.btnMessage', loadMessagePopup);
$('.sidebar').on('click', '.btnBack', loadMain);
//$('.sidebar').on('click', '.btnCreateMessage', loadCreateMessage);
$('.sidebar').on('click', '.btnFeedback', loadFeedback);
$('.sidebar').on('click', '.btnUserBackend', loadUserBackend);

$(document).ready(function() {
  //reload the site at 02:00
  refreshAt(2,0,0);
  //and every 2 hours
  reloadPageTimeout = setTimeout(function(){window.location.reload(true)},reloadPageTime);
});

$('.sidebarSwiper').swipe({
  swipeStatus:function(event,phase,direction,distance,duration,fingers) {
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
  showMain = true;
  usercollection = new Array();
  $("#header").empty();
  project.clear();
  $("#sidebarMain .sidebarUpper").empty();
  removeAllGifs();
  getBoard();
  showSidebar('sidebarMain');
  $('#header').text('header');
  if(usercollection.length > 0) {
    showUser(usercollection[0].id);
  }
  $('#EditorCanvas').css('visibility','visible');
  $('#tabletSizePreview').css('visibility','visible');
  show_gifs();
  addGifTicker();
  startSwitchUserTimer();
  closeEditorPopup();
}

function loadUserBackend(event) {
  userLoginPopup();
}
function loadFeedback(event) {
  $('#header').text('Feedback');
  showSidebar('sidebarFeedback');
  updateTimer();
}
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
  closeEditorPopup();
}

function showSidebar(sidebar) {
  switch(sidebar){
    case 'sidebarMain':
      hideAll();
      $('#sidebarMain').css('visibility', 'visible');
      $('#myCanvas').css('visibility','visible');
      break;
    case 'sidebarUserBackend':
      hideAll();
      $('#sidebarUserBackend').css('visibility', 'visible');
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
    case 'loadUserSettings':
      hideAll();
      $('#sidebarBackendUserSettings').css('visibility','visible');
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
  $('#sidebarCreateMessage').css('visibility','hidden');
  $('#sidebarFeedback').css('visibility','hidden');
  $('#sidebarChangeStatus').css('visibility','hidden');
  $('#sidebarChangeContent').css('visibility','hidden');
  $('#sidebarViewMessages').css('visibility','hidden');
  $("#sidebarUserBackend").css('visibility','hidden');
  $('#sidebarUserSettings').css('visibility','hidden');
  $('#EditorCanvas').css('visibility','hidden');
  $('#tabletSizePreview').css('visibility','hidden');
  closeContainer();
  resetColor();
  resetStrokeSize();
  removeImageDropLayer();
  removeAllGifs();
  hide_gifs();
  stopSwitchUserTimer();
  removeListeners();
  showMessages = false;
  showMain = false;
}

function showPopup() {
  closeEditorPopup();
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

function showFloaty(text,time) {
  clearTimeout(floatyTimer);
  $("#floaty").css("left", $(window).width()/2-$("#floaty").width()/2 + "px");
  $("#floaty").empty();
  $("#floaty").append("<h3>"+text);
  $("#floaty").animate({top: '50px'},"slow");
  if(!time) {
    floatyTimer = setTimeout(removeFloaty, floatyTime);
  }
  else {
    floatyTimer = setTimeout(removeFloaty, time);
  }
}

function removeFloaty() {
  $("#floaty").animate({top: '-350px'},"slow");
}

function refreshAt(hours, minutes, seconds) {
  var now = new Date();
  var then = new Date();

  if(now.getHours() > hours ||
     (now.getHours() == hours && now.getMinutes() > minutes) ||
      now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
      then.setDate(now.getDate() + 1);
  }
  then.setHours(hours);
  then.setMinutes(minutes);
  then.setSeconds(seconds);

  var timeout = (then.getTime() - now.getTime());
  setTimeout(function() { window.location.reload(true); }, timeout);
}

