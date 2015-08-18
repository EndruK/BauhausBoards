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
  // add the event listeners
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
  //remove the popup of the selection if there is one
  removeSelectionPopup();
  //remove the bounding box if there is one
  removeBoundingBox();
  //deselect all items
  project.deselectAll();
  var hit = project.hitTest(event.point);
  // if nothing was hit
  if(!hit) {
    //remove the bounding rect from the canvas
    if(selectionPath != null) {
      selectionPath.remove();
      selectionPath = null;
    }
  }
  else {
    //deselect all former selected items
    project.deselectAll();
    //select the one which was hit
    hit.item.selected = true;
  }
  //get the actual click point
  mousePoint = event.point;
  //remove the bounding rect from the canvas
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function selectorMouseUp(event) {
  //only if there are selected items
  if(project.selectedItems.length != 0) {
    //remove the former selection box
    if(selectionPath != null) {
      selectionPath.remove();
    }
    if(boundingBox != null) {
      boundingBox.remove();
    }
    //make a new selection box
    makeBox();
    //add the popup in the selection box
    addSelectionPopup();
  }
  //remove the cursor box drawn by the user
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function makeBox() {
  //create a new box arround all selected items
  boundingBox = new Shape.Rectangle(getBoundingBox());
  boundingBox.strokeColor = "black";
  boundingBox.fillColor = "black";
  boundingBox.fillColor.alpha = 0.1;
  boundingBox.dashArray = [10,12];
}
function selectorMouseDrag(event) {
  //refresh the rectangle the user is actually drawing
  selectionRect = new Rectangle(mousePoint,event.point);
  if(selectionPath != null) {
    selectionPath.remove();
  }
  selectionPath = new Shape.Rectangle(selectionRect);
  selectionPath.strokeColor = "black";
  selectionPath.fillColor = "black";
  selectionPath.fillColor.alpha = 0.1;
  selectionPath.dashArray = [10,12];
  //deselect all items
  project.deselectAll();
  //recheck the items in the selection rectangle
  selectItems();
}
function selectItems() {
  //get all Path Items
  var pathItems = project.getItems({
    class: Path
  });
  //get all PointText Items
  var textItems = project.getItems({
    class: PointText
  });
  //iterate over all Path Items
  pathItems.forEach(function(key) {
    //check if the items intersect or are inside of the selection rect
    if(selectionPath.intersects(key) || selectionPath.bounds.contains(key.bounds)) {
      //if true: mark them as selected
      key.selected = true;
    }
  });
  //iterate over all Path Items
  textItems.forEach(function(key) {
    //check if the items intersect or are inside of the selection rect
    if(selectionPath.bounds.intersects(key.bounds) || selectionPath.bounds.contains(key.bounds)) {
      //if true: mark them as selected
      key.selected = true;
    }
  });
}
function deactivateSelector() {
  //deactivate everything for the selector
  //remove the selection path in the canvas
  if(selectionPath != null) {
    selectionPath.remove();
  }
  //remove the popup
  removeSelectionPopup();
  //remove the bounding box
  removeBoundingBox();
  //unselect all items
  project.deselectAll();
  //refresh the view
  view.update();
}
function addSelectionPopup() {
  //get the height of the header div
  var headerHight = $("#header").height();
  //get the bounding box dimensions
  var upperLeft = boundingBox.bounds.topLeft;
  var upperRight = boundingBox.bounds.topRight;
  var lowerLeft = boundingBox.bounds.bottomLeft;
  var lowerRight = boundingBox.bounds.bottomRight;
  //console.log(boundingBox.bounds);
  //get the middle of the bounding box
  var middleX = boundingBox.bounds.x + Math.round(boundingBox.bounds.width/2);
  var middleY = boundingBox.bounds.y + Math.round(boundingBox.bounds.height/2);

  //add the popup div
  $("#content").append("<div id='popupSelector'></div>");
  var popup = $("#popupSelector");
  //add buttons to the popup div
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupRemove'>Delete</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerUp'>LayerUp</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupLayerDown'>LayerDown</button>");
  popup.append("<button class='btnSelectorPopup' id='btnSelectorPopupCopy'>Copy</button>");

  $("#btnSelectorPopupRemove").on("click",btnRemove);

  //center the popup in the bounding box
  var left = middleX - Math.round(popup.width()/2);
  var top  = middleY - Math.round(popup.height()/2)+headerHight;

  //bugfix if the bounding box goes over the canvas sizes
  //the popup have to be in the view
  if(left+popup.width() >= $("#EditorCanvas").width()) {
    left = left-popup.width();
  }
  if(top+popup.height() >= $("#EditorCanvas").width()) {
    top = top-popup.height();
  }
  //add the attributes to the css of the popup
  popup.css("visibility","visible");
  popup.css("top",top);
  popup.css("left",left);
}
function removeSelectionPopup() {
  var popup = $("#popupSelector");
  //remove the popup
  if(popup) {
    popup.remove();
  }
}
function getBoundingBox() {
  //get all items
  var items = project.selectedItems;
  var left = Number.MAX_VALUE;
  var right = 0;
  var top = Number.MAX_VALUE;
  var bottom = 0;
  //get dimensions of all selected items
  items.forEach(function(key) {
    //console.log(key.bounds);
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
  //return the bounding box rectangle
  return new Rectangle(new Point(left,top), new Point(right,bottom));
}
function removeBoundingBox() {
  //remove the bound box
  if(boundingBox != null) {
    boundingBox.remove();
  }
}
function btnRemove(event) {
  //console.log("delete element");
  var items = project.selectedItems;
  items.forEach(function(key) {
    key.remove();
  });
  removeBoundingBox();
  removeSelectionPopup();
  view.update();
}