//$('.sidebar').on('click', '.test', test);
//$('.sidebar').on('click', '.test2', test2);
//$('.sidebar').on('click', '.refresh', refreshCanvas);

paper.install(window);
$(document).ready(function() {
  paper.setup('myCanvas');
  var tool = new Tool();
  var path;
  tool.onMouseDown = function(event) {
    path = new Path();
    path.strokeColor = 'black';
    path.add(event.point);
  }
  tool.onMouseDrag = function(event) {
    path.add(event.point);
  }
});