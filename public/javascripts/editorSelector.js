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
//var mouseDown;
//var rect;

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
  //mouseDown = event.point;
  //rect = new Rectangle(event.point,event.point);
  //rect.
}
function selectorMouseUp(event) {
  //console.log("selector mouse up");
  //rect = new Rectangle(mouseDown,event.point);
  //console.log(mouseDown);
  //console.log(event.point);
}
function selectorMouseMove(event) {
  //console.log("selector mouse move");
  //rect = new Rectangle(mouseDown,event.point);
}
function selectorMouseDrag() {
  //console.log("mouse was dragged");
}