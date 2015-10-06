//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorPen', activatePenTool);
var penTool;
var path;
var moved = false;
$(document).ready(function() {
  //initialize the pen event handler tool
  penTool = new Tool();
});

function penMouseDown(event) {
  //create a new path
  path = new Path();
  path.fillColor = rgbToHex(activeColor);
  startPosition = event.point;
  //path.strokeWidth = strokeSize*5;
  //path.strokeJoin = 'round';
  moved = false;
}

function penMouseDrag(event) {
  //add a point to the new path
  var step = event.delta.divide(2);
  step.angle += 90;
  step.length = strokeSize*5;
  var top = event.middlePoint.add(step);
  var bottom = event.middlePoint.subtract(step);
  path.add(top);
  path.insert(0,bottom);
  moved = true;
}

function penMosueUp(event) {
  if(moved) {
    //the path should be closed
    path.closed = true;
    //simplify the path to lower the ammount of points
    path.simplify();
  }
  else {
    //draw a dot
    var p = event.point;
    var d = strokeSize*5;
    var p1 = new Point(p.x+d,p.y  );
    var p2 = new Point(p.x  ,p.y+d);
    var p3 = new Point(p.x-d,p.y  );
    var p4 = new Point(p.x  ,p.y-d);
    path.add(p1);
    path.add(p2);
    path.add(p3);
    path.add(p4);
    path.closed = true;
    path.smooth();
  }
}
function activatePenTool(event) {
  console.log($(this).attr('class'));
  //$('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  penTool = new Tool();
  //set up he mouse listeners
  penTool.onMouseDown = penMouseDown;
  penTool.onMouseDrag = penMouseDrag;
  penTool.onMouseUp   = penMosueUp;
  penTool.activate();
  penTool.minDistance = 10;
}