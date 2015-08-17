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
  //selectorTool.onMouseMove = selectorMouseMove;
  selectorTool.onMouseDrag = selectorMouseDrag;
}
var mousePoint;
var selectionPath = null;
var selectionRect = null;
var boundingBox = null;

function selectorMouseDown(event) {
  removeSelectionPopup();
  removeBoundingBox();
  project.deselectAll();
  var hit = project.hitTest(event.point);
  // if no hit
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
  if(project.selectedItems.length != 0) {
    if(selectionPath != null) {
      selectionPath.remove();
    }
    if(boundingBox != null) {
      boundingBox.remove();
    }
    makeBox();
    addSelectionPopup();
  }
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function makeBox() {
  boundingBox = new Shape.Rectangle(getBoundingBox());
  boundingBox.strokeColor = "black";
  boundingBox.fillColor = "black";
  boundingBox.fillColor.alpha = 0.1;
  boundingBox.dashArray = [10,12];
}
/*function testPos(pos) {
  return selectionPath.bounds.intersects(pos);
}*/
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
  selectItems();
}
function selectItems() {
  var pathItems = project.getItems({
    class: Path
  });
  var textItems = project.getItems({
    class: PointText
  });
  pathItems.forEach(function(key) {
    if(selectionPath.intersects(key) || selectionPath.bounds.contains(key.bounds)) {
      key.selected = true;
    }
  });
  textItems.forEach(function(key) {
    if(selectionPath.intersects(key) || selectionPath.bounds.contains(key.bounds)) {
      key.selected = true;
    }
  });
}
function deactivateSelector() {
  if(selectionPath != null) {
    selectionPath.remove();
  }
  removeSelectionPopup();
  removeBoundingBox();
  project.deselectAll();
  view.update();
}
function addSelectionPopup() {
  var headerHight = $("#header").height();
  var upperLeft = boundingBox.bounds.topLeft;
  var upperRight = boundingBox.bounds.topRight;
  var lowerLeft = boundingBox.bounds.bottomLeft;
  var lowerRight = boundingBox.bounds.bottomRight;
  //console.log(boundingBox.bounds);
  var middleX = boundingBox.bounds.x + Math.round(boundingBox.bounds.width/2);
  var middleY = boundingBox.bounds.y + Math.round(boundingBox.bounds.height/2);

  $("#content").append("<div id='popupSelector'></div>");
  var popup = $("#popupSelector");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupRemove'>Delete</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerUp'>LayerUp</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerDown'>LayerDown</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupCopy'>Copy</button>");

  var left = middleX - Math.round(popup.width()/2);
  var top  = middleY - Math.round(popup.height()/2)+headerHight;

  popup.css("visibility","visible");
  //popup.css("left",lowerLeft.x);
  //popup.css("top",lowerLeft.y+headerHight);
  popup.css("top",top);
  popup.css("left",left);
}
function removeSelectionPopup() {
  var popup = $("#popupSelector");
  if(popup) {
    popup.remove();
  }
}
function getBoundingBox() {
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