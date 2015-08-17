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
var selectionRect = null;
var selectionPath = null;

function selectorMouseDown(event) {
  //console.log("selector mouse down");
  var hit = project.hitTest(event.point);
  console.log(hit);
  // if no hit
  if(!hit) {
    project.deselectAll();
  }
  else {
    project.deselectAll();
    hit.item.selected = true;
  }
  mousePoint = event.point;
  if(selectionPath) {
    selectionPath.remove();
  }
}
function selectorMouseUp(event) {
  mouseDown = false;
  //console.log("selector mouse up");
  //selectionRect = new Rectangle(mousePoint,event.point);
  //selectionPath.remove();
  //selectionPath = new Path.Rectangle(selectionRect);
  //console.log(mouseDown);
  //console.log(event.point);
  /*var TL = new Point(100,100);
  var BR = new Point(500,500);
  var rect = new Rectangle(TL,BR);
  var path = new Path.Rectangle(rect);
  path.strokeColor = "black";
  path.selected = true;*/
}
function selectorMouseMove(event) {
  /*console.log(mouseDown);
  if(mouseDown) {
    console.log("make rect");
  }*/
}
function selectorMouseDrag(event) {
  //console.log("mouse was dragged");
  /*if(selectionPath) {
    selectionPath.remove();
  }*/
  selectionRect = new Rectangle(mousePoint,event.point);
  if(selectionPath != null) {
    selectionPath.remove();
  }
  selectionPath = new Shape.Rectangle(selectionRect);
  selectionPath.strokeColor = "black";
  selectionPath.dashArray = [10,12];
}