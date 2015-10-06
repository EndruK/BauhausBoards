$('.sidebar').on('click', '.btnEditorStroke', function(event) {
  openStrokePopup(event);
});
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
  var width = 50*4;
  var height = 50*1;
  var posX = event.pageX;
  var posY = event.pageY;

  openEditorPopup($(event.toElement),width,height,posX,posY,function() {
    $("#editorPopup").append("<div class='minStroke strokeTile' title='min stroke'><div>");
    $("#editorPopup").append("<div class='smallStroke strokeTile' title='small stroke'><div>");
    $("#editorPopup").append("<div class='greatStroke strokeTile' title='great stroke'><div>");
    $("#editorPopup").append("<div class='maxStroke strokeTile' title='max stroke'><div>");
    $(".strokeTile div").css("background-color",rgbToHex(activeColor));
    $("#editorPopup").append("<div class='clear'>");
    $("#editorPopup .strokeTile").on("click", switchStroke);
  });
}

function switchStroke() {
  startEditorPopupTimer();
  updateTimer();
  var clicked = $(this).attr("class").split(" ")[0];
  console.log(clicked);
  switch(clicked) {
    case "minStroke":
      strokeSize = 1;
      setSidebarStrokeButtonClass("minStroke")
      break;
    case "smallStroke":
      strokeSize = 2;
      setSidebarStrokeButtonClass("smallStroke")
      break;
    case "greatStroke":
      strokeSize = 3;
      setSidebarStrokeButtonClass("greatStroke")
      break;
    case "maxStroke":
      strokeSize = 4;
      setSidebarStrokeButtonClass("maxStroke")
      break;
    default:
      strokeSize = 1;
      break;
  }
}

function setSidebarStrokeButtonClass(name) {
  $(".btnEditorStroke span div").removeClass("minStroke");
  $(".btnEditorStroke span div").removeClass("smallStroke");
  $(".btnEditorStroke span div").removeClass("greatStroke");
  $(".btnEditorStroke span div").removeClass("maxStroke");
  $(".btnEditorStroke span div").addClass(name);
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