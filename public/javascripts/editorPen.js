//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorPen', activatePenTool);
var penTool;
var path;
$(document).ready(function() {
  //initialize the pen event handler tool
  penTool = new Tool();
});

function penMouseDown(event) {
  //create a new path
  path = new Path();
  path.fillColor = rgbToHex(activeColor);
  //path.strokeWidth = strokeSize*5;
  //path.strokeJoin = 'round';
}

function penMouseDrag(event) {
  //add a point to the new path
  //path.add(event.point);
  var step = event.delta.divide(2);
  step.angle += 90;
  step.length = strokeSize*5;
  var top = event.middlePoint.add(step);
  //console.log(top);
  var bottom = event.middlePoint.subtract(step);
  path.add(top);
  path.insert(0,bottom);
}

function penMosueUp(event) {
  //simplify the path to lower the ammount of points
  path.closed = true;
  path.simplify();
  //console.log(path);
  //interaction.push({"addPath",path.exportJSON(),false});
  var obj = new Object();
  obj.type = "addPath";
  obj.content = [path.id,path.exportJSON()];
  obj.undo = false;
  removeAllUndoed();
  interaction.push(obj);
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
  tool.minDistance = 10;
}