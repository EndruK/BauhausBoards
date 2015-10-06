//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorEraser', activateEraserTool);
var eraserTool;
$(document).ready(function() {
  //initialize the eraser event handler tool
  eraserTool = new Tool();
});
function activateEraserTool(event) {
  showIcon("eraser");
  console.log($(this).attr('class'));
  //$('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  eraserTool = new Tool();
  eraserTool.onMouseDrag = eraserMouseDrag;
  eraserTool.onMouseDown = eraserMouseDrag;
  eraserTool.activate();
}
function eraserMouseDrag(event) {
  var paths = project.getItems({
    class: Path
  });
  var texts = project.getItems({
    class: PointText
  })
  var rasters = project.getItems({
    class: Raster
  });
  checkHit(paths,event.point);
  checkHit(texts,event.point);
  checkHit(rasters,event.point);
}
function checkHit(items,point) {
  items.forEach(function(key) {
    if(key.hitTest(point)) {
      key.remove();
    }
  });
}