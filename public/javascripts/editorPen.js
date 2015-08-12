//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorPen', activatePenTool);
$(document).ready(function() {
  //initialize the pen event handler tool
  penTool = new Tool();
});

function penMouseDown(event) {
  //create a new path
  path = new Path();
  path.strokeColor = 'black';
  path.strokeWidth = strokeSize*3;
}

function penMouseDrag(event) {
  //add a point to the new path
  path.add(event.point);
}

function penMosueUp(event) {
  //simplify the path to lower the ammount of points
  path.simplify();
  //TODO: add this path to the set of canvas objects
}
function activatePenTool(event) {
  console.log($(this).attr('class'));
  $('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  penTool = new Tool();
  //set up he mouse listeners
  penTool.onMouseDown = penMouseDown;
  penTool.onMouseDrag = penMouseDrag;
  penTool.onMouseUp   = penMosueUp;
  penTool.activate();
}