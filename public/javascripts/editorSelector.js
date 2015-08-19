//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorSelector', activateSelectorTool);
var selectorTool;
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
  selectorTool.onMouseDrag = selectorMouseDrag;
}
var mousePoint;
var selectionPath = null;
var selectionRect = null;
var boundingBox = null;
var dragElement = false;
var scaleElement = false;
var rotateElement = false;
var pOld = null;
var scaleCircles = new Array();
var rotationCircle = null;
var selectionScale;

function selectorMouseDown(event) {
  //get the actual click point
  mousePoint = event.point;
  if(scaleCircles.length > 0) {
    var breakOut = false;
    scaleCircles.forEach(function(key) {
      if(key.contains(event.point)) {
        //TODO: change the mouse apperance?
        scaleElement = true;
        breakOut = true;
        for(var i=0; i<scaleCircles.length; ++i) {
          if(scaleCircles[i].contains(event.point)) {
            selectionScale = mousePoint.subtract(boundingBox.bounds.center).length/selectionPath.scaling.x;
          }
        }
        return;
      }
    });
    if(breakOut) {
      return;
    }
  }
  if(rotationCircle != null && rotationCircle.contains(event.point)) {
    rotateElement = true;
    return;
  }
  //check if there is a bounding box and click point was in bounding box
  if(boundingBox != null && boundingBox.bounds.contains(event.point)) {
    dragElement = true;
    return;
  }
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
    dragElement = true;
  }
  //remove the bounding rect from the canvas
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function selectorMouseUp(event) {
  if(dragElement) {
    dragElement = false;
    pOld = null;
  }
  if(scaleElement) {
    scaleElement = false;
  }
  if(rotateElement) {
    rotateElement = false;
    pOld = null;
  }
  removeSelectionPopup();
  removeBoundingBox();
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
  boundingBox = new Path.Rectangle(getBoundingBox());
  boundingBox.strokeColor = "black";
  boundingBox.fillColor = "black";
  boundingBox.fillColor.alpha = 0.1;
  boundingBox.dashArray = [10,12];
  var topLeft = boundingBox.bounds.topLeft;
  var topRight = boundingBox.bounds.topRight;
  var width = topRight.x-topLeft.x;
  var middle = topLeft.x + width/2;
  var top = topLeft.y-25;
  var point = new Point(middle,top);
  // add the scale circles at the corners of the bounding box
  addScaleCircles();
  boundingBox.insert(2, new Point(topLeft.x+width/2,topLeft.y));
  boundingBox.insert(2, point);
  boundingBox.insert(2, new Point(topLeft.x+width/2,topLeft.y));
  addRotationCircle(point);
}
function addRotationCircle(point) {
  var circleSize = 20;
  if(rotationCircle) {
    rotationCircle.remove();
  }
  rotationCircle = new Shape.Circle(point,circleSize);
  rotationCircle.fillColor = 'black';
  rotationCircle.fillColor.alpha = 0.2;
  //rotationCircle.visible = false;

}
function addScaleCircles() {
  var circleSize = 20;

  var topLeft     = boundingBox.bounds.topLeft;
  var topRight    = boundingBox.bounds.topRight;
  var bottomLeft  = boundingBox.bounds.bottomLeft;
  var bottomRight = boundingBox.bounds.bottomRight;
  
  var topLeftCircle  = new Shape.Circle(topLeft,circleSize);
  topLeftCircle.fillColor = 'black';
  topLeftCircle.fillColor.alpha = 0.1;
  var topRightCircle = new Shape.Circle(topRight,circleSize);
  topRightCircle.fillColor = 'black';
  topRightCircle.fillColor.alpha = 0.1;
  var bottomLeftCircle  = new Shape.Circle(bottomLeft,circleSize);
  bottomLeftCircle.fillColor = 'black';
  bottomLeftCircle.fillColor.alpha = 0.1;
  var bottomRightCircle = new Shape.Circle(bottomRight,circleSize);
  bottomRightCircle.fillColor = 'black';
  bottomRightCircle.fillColor.alpha = 0.1;
  /*
  topLeftCircle.visible = false;
  topRightCircle.visible = false;
  bottomLeftCircle.visible = false;
  bottomRightCircle.visible = false;
  */
  //remove all previous circles
  scaleCircles.forEach(function(key) {
    key.remove();
  });
  //add the new circles to the array
  scaleCircles.push(topLeftCircle);
  scaleCircles.push(topRightCircle);
  scaleCircles.push(bottomLeftCircle);
  scaleCircles.push(bottomRightCircle);
}
function selectorMouseDrag(event) {
  //if user drags an element
  if(dragElement == true) {
    console.log("drag");
    //get the point where the user started the drag
    if(pOld == null){
      console.log("reset pOld");
      pOld = mousePoint;
    }
    //get the actual point of the mouse
    var pNow = event.point;
    //calculate the translation vector
    var vec    = pNow.subtract(pOld);
    //get all selected items
    var items  = project.selectedItems;
    //remove the bounding box and the popup
    removeSelectionPopup();
    removeBoundingBox();
    //translate the objects
    items.forEach(function(key) {
      key.translate(vec);
    });
    //set the old point for the next drag iteration
    pOld = pNow;
    makeBox();
    view.update();
    //dont do anything else
    return;
  }
  else if(scaleElement == true) {
    console.log("scale");
    //TODO: rebuild this function with pOld and anchor point
    //TODO: always add the distance between pOld and pNew to anchorToAnchorVec and divide by this
    var ratio = event.point.subtract(boundingBox.bounds.center).length/selectionScale;
    var scaling = new Point(ratio,ratio);

    var items = project.selectedItems;
    items.forEach(function(key) {
      key.scaling = scaling;
    });
    removeSelectionPopup();
    removeBoundingBox();
    makeBox();
    //dont do anything else
    return;
  }
  else if(rotateElement == true) {
    console.log("rotate");
    if(pOld == null){
      pOld = mousePoint;
    }
    var pCenter = boundingBox.bounds.center;
    var pClick  = mousePoint;
    var pMouse  = event.point;
    var pLast = pOld;

    var vecPMouse = pCenter.subtract(pMouse)
    //var vecPClick = pCenter.subtract(pClick);
    var vecPLast = pCenter.subtract(pLast);

    //var angle = pMouse.subtract(pCenter).angle + 90;
    var angle = vecPMouse.angle - vecPLast.angle;
    var items = project.selectedItems;
    //makeBox()
    boundingBox.rotate(angle,pCenter);
    rotationCircle.rotate(angle,pCenter);
    scaleCircles.forEach(function(key) {
      key.rotate(angle,pCenter);
    });
    items.forEach(function(key) {
      key.rotate(angle,pCenter);
    });
    removeSelectionPopup();
    pOld = pMouse;
    view.update();
    //console.log(pCenter);
    return;
  }
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
  $("#btnSelectorPopupCopy").on("click",btnCopy);
  $("#btnSelectorPopupLayerUp").on("click",btnLayerUp);
  $("#btnSelectorPopupLayerDown").on("click",btnLayerDown);

  //center the popup in the bounding box (with additional horizonal space)
  var horSpace = 20;
  var left = middleX - Math.round(popup.width()/2);
  var top  = middleY - Math.round(popup.height()/2)+headerHight + horSpace;

  //bugfix if the bounding box goes over the canvas sizes
  //the popup have to be in the view
  if(left+popup.width() >= $("#EditorCanvas").width()) {
    left = $("#EditorCanvas").width()-popup.width();
  }
  if(top+popup.height() >= $("#EditorCanvas").height()) {
    top = $("#EditorCanvas").height()+headerHight-popup.height();
  }
  if(left <= 0) {
    left = 0;
  }
  if(top <= headerHight) {
    top = headerHight;
  }
  //add the attributes to the css of the popup
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
  var rect = new Rectangle(new Point(left,top), new Point(right,bottom));
  return rect;
}
function removeBoundingBox() {
  //remove the bound box
  if(boundingBox != null) {
    boundingBox.remove();
    boundingBox = null;
  }
  scaleCircles.forEach(function(key) {
    key.remove();
  });
  scaleCircles = new Array();
  if(rotationCircle) {
    rotationCircle.remove();
  }
  rotationCircle = null;
}
function btnRemove(event) {
  //console.log("delete element");
  //get all selected items
  var items = project.selectedItems;
  //remove all selected items
  items.forEach(function(key) {
    key.remove();
  });
  //temove bounding box and popup
  removeBoundingBox();
  removeSelectionPopup();
  //refresh the view
  view.update();
}
function btnCopy(event) {
  //get all selected items
  var items = project.selectedItems;
  //initialize the array for the copies
  var copies = new Array();
  //deselect all, remove bounding box and the popup
  project.deselectAll();
  removeBoundingBox();
  removeSelectionPopup();
  //clone all items which were selected
  items.forEach(function(key) {
    var copy = key.clone()
    copy.position.x += 25;
    copy.position.y += 25;
    copy.selected = true;
    copies.push(copy);
  });
  //add the bounding box and the popupt
  makeBox();
  addSelectionPopup();
  //refresh the view
  view.update();
}
//brings all selected items in front
function btnLayerUp() {
  var items = project.selectedItems;
  items.forEach(function(key) {
    key.bringToFront();
  });
  view.update();
}
//brings all selected items to back
function btnLayerDown() {
  var items = project.selectedItems;
  items.forEach(function(key) {
    key.sendToBack();
  });
  view.update();
}