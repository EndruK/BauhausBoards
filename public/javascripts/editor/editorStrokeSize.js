$('.sidebar').on('click', '.btnStroke', openStrokePopup);
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

function openStrokePopup(event) {
  openEditorPopup(this,width,height,function() {
    $("#editorPopup").append("<div id='minStroke' class='strokeTile'>");
    $("#editorPopup").append("<div id='smallStroke' class='strokeTile'>");
    $("#editorPopup").append("<div id='greatStroke' class='strokeTile'>");
    $("#editorPopup").append("<div id='maxStroke' class='strokeTile'>");
    $(".strokeTile").on("click", switchStroke);
  });
}


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
    console.log($(this));
    if($(this).find("div.strokeMin").length != 0) {
      strokeSize = 1;
    }
    else if($(this).find("div.strokeSmall").length != 0) {
      strokeSize = 2;
    }
    else if($(this).find("div.strokeBig").length != 0) {
      strokeSize = 3;
    }
    else if($(this).find("div.strokeMax").length != 0) {
      strokeSize = 4;
    }
    activatePenTool();
    $(".btnStroke").text("Stroke: " + strokeSize);
    clearTimeout(containerTimeoutHandler);
    closeContainer();
  }
}
function openContainer() {
  var container = $(".strokeSizes");
  container.css("visibility","visible");
  container.css("position","relative");
}
function closeContainer() {
  var container = $(".strokeSizes");
  container.css("visibility","hidden");
  container.css("position","absolute");
  containerOpen = false;
}
function updateContainerTimeout() {
  clearTimeout(containerTimeoutHandler);
  containerTimeoutHandler = setTimeout(closeContainer,containerTimeout);
}
function resetStrokeSize() {
  strokeSize = 1;
  $(".btnStroke").text("Stroke: 1");
  var strokeBar = $(".strokeBar");
  strokeBar.css("background-color","black");
}