//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorSelector', activateSelectorTool);
$(document).ready(function() {
  //initialize the selector event handler tool
  selectorTool = new Tool();
});
function activateSelectorTool(event) {
  console.log($(this).attr('class'));
  $('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  selectorTool = new Tool();
  selectorTool.onMouseDown = selectorMouseDown;
  selectorTool.onMouseUp   = selectorMouseUp;
  selectorTool.onMouseMove = selectorMouseMove;
  selectorTool.onMouseDrag = selectorMouseDrag;
}
var mousePoint;
var selectionPath = null;
var selectionRect = null;
var boundingBox = null;

function selectorMouseDown(event) {
  removeSelectionPopup();
  removeBoundingBox();
  var hit = project.hitTest(event.point);
  //console.log(hit);
  // if no hit
  project.deselectAll();
  if(!hit) {
    if(selectionPath != null) {
      selectionPath.remove();
      selectionPath = null;
    }
  }
  else {
    project.deselectAll();
    hit.item.selected = true;
  }
  mousePoint = event.point;
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function selectorMouseUp(event) {
  if(selectionPath != null) {
    addSelectionPopup();
    selectionPath.remove();
    //var tmp = new Rectangle(makeSelectionRectangle());
    if(boundingBox != null) {
      boundingBox.remove();
    }
    boundingBox = new Shape.Rectangle(makeBoundingBox());
    boundingBox.strokeColor = "black";
    boundingBox.fillColor = "black";
    boundingBox.fillColor.alpha = 0.1;
    boundingBox.dashArray = [10,12];
  }

}
function testPos(pos) {
  return selectionPath.bounds.contains(pos);
}
function selectorMouseMove(event) {

}
function selectorMouseDrag(event) {
  selectionRect = new Rectangle(mousePoint,event.point);
  if(selectionPath != null) {
    selectionPath.remove();
  }
  selectionPath = new Shape.Rectangle(selectionRect);
  selectionPath.strokeColor = "black";
  selectionPath.fillColor = "black";
  selectionPath.fillColor.alpha = 0.1;
  selectionPath.dashArray = [10,12];
  project.deselectAll();
  var pathItems = project.getItems({
    position: testPos,
    class: Path
  });
  var textItems = project.getItems({
    position: testPos,
    class: PointText
  });
  pathItems.forEach(function(key) {
    key.selected = true;
  });
  textItems.forEach(function(key) {
    key.selected = true;
  });
}
function deactivateSelector() {
  if(selectionPath != null) {
    selectionPath.remove();
    view.update();
  }
  removeSelectionPopup();
  removeBoundingBox();
}
function addSelectionPopup() {
  var headerHight = $("#header").height();
  //console.log(headerHight);
  var upperLeft = selectionRect.topLeft;
  var upperRight = selectionRect.topRight;
  var lowerLeft = selectionRect.bottomLeft;
  var lowerRight = selectionRect.bottomRight;
  //console.log(lowerLeft);
  //console.log(lowerRight);

  $("#content").append("<div id='popupSelector'></div>");
  var popup = $("#popupSelector");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupRemove'>Delete</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerUp'>LayerUp</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerDown'>LayerDown</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupCopy'>Copy</button>");
  popup.css("visibility","visible");
  popup.css("left",lowerLeft.x);
  popup.css("top",lowerLeft.y+headerHight);
}
function removeSelectionPopup() {
  $("#popupSelector").remove();
}
function makeBoundingBox() {
  var items = project.selectedItems;
  var left = Number.MAX_VALUE;
  var right = 0;
  var top = Number.MAX_VALUE;
  var bottom = 0;
  items.forEach(function(key) {
    console.log(key.bounds);
    if(key.bounds.x < left) {
      left = key.bounds.x;
    }
    if((key.bounds.x+key.bounds.width) > right) {
      right = key.bounds.x+key.bounds.width;
    }
    if(key.bounds.y < top) {
      top = key.bounds.y;
    }
    if((key.bounds.y+key.bounds.height) > bottom) {
      bottom = key.bounds.y+key.bounds.height;
    }
  });
  return new Rectangle(new Point(left,top), new Point(right,bottom));
}
function removeBoundingBox() {
  if(boundingBox != null) {
    boundingBox.remove();
  }
}