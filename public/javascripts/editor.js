//$('.sidebar').on('click', '.test', test);
//$('.sidebar').on('click', '.test2', test2);
$('.sidebar').on('click', '.refresh', refreshCanvas);

paper.install(window);
$(document).ready(function() {
  paper.setup('drawMessage');
  var tool = new Tool();
  //var path;
  var text = new PointText({
    point: [240,30],
    content: 'Draw Something :)',
    fillColor: 'black',
    font: 'arial',
    fontWeight: 'bold',
    fontSize: 30
  });

  tool.onMouseDown = function(event) {
    path = new Path();
    path.strokeColor = 'black';
    path.add(event.point);
  }
  tool.onMouseDrag = function(event) {
    path.add(event.point);
  }
});
function refreshCanvas(event) {
  paper.setup('drawMessage');
}