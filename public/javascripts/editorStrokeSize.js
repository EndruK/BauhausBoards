$('.sidebar').on('click', '.stroke', handlePopup);
var strokeSize;
var containerOpen;
var containerTimeout = 5000;
var containerTimeoutHandler;
$(document).ready(function() {
  //initialize stroke size with 2
  strokeSize = 1;
  containerOpen = false;
});

function handlePopup(event) {
  console.log("stroke");
  //reset the sidebar timer
  updateTimer();
  //container is closed
  if(!containerOpen) {
    //set the stroke size container timeout
    updateContainerTimeout();
    openContainer();
    containerOpen = true;
  }
  //container is open
  else {
    switch($(this).attr("id")) {
      case "strokeA":
        strokeSize = 1;
        break;
      case "strokeB":
        strokeSize = 2;
        break;
      case "strokeC":
        strokeSize = 3;
        break;
      case "strokeD":
        strokeSize = 4;
        break;
    }
    //$("#header").text(strokeSize);
    $(".strokeSelected").removeClass("strokeSelected");
    $(this).addClass("strokeSelected");
    clearTimeout(containerTimeoutHandler);
    closeContainer();
    containerOpen = false;
  }
}
function openContainer() {
  var container = $(".stroke");
  var selected  = $(".strokeSelected");
  container.css("position","relative");
  container.css("visibility","visible");
  selected.css("float","left");
}
function closeContainer() {
  var container = $(".stroke");
  var selected  = $(".strokeSelected");
  container.css("position","absolute");
  container.css("visibility","hidden");
  selected.css("float","none");
  //selected.css("background-color","rgba(0,0,0,0)");
  selected.css("visibility","inherit");
  selected.css("position","inherit");
}
function updateContainerTimeout() {
  clearTimeout(containerTimeoutHandler);
  containerTimeoutHandler = setTimeout(closeContainer,containerTimeout);
}