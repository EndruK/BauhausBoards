$('.sidebar').on('click', '.test', test);
$('.sidebar').on('click', '.test2', test2);
$('.sidebar').on('click', '.refresh', refreshCanvas);
var canvas = document.getElementById('myCanvas');
paper.setup(canvas);

function test(event) {
  console.log("drawing line");
  var path = new paper.Path();
  path.strokeColor = 'black';
  var start = new paper.Point(100,100);
  path.moveTo(start);
  path.lineTo(start.add([ 200, -50 ]));
  paper.view.draw();
}
function test2(event) {
  console.log("drawing circle");
  var path2 = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'black'
  });
  paper.view.draw();
}
function refreshCanvas(event) {
  console.log("refreshing the canvas");
  paper.setup(canvas);
  paper.view.draw();
}