//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorEraser', activateEraserTool);
var eraserTool;
$(document).ready(function() {
  //initialize the selector event handler tool
  eraserTool = new Tool();
});
function activateEraserTool(event) {
  console.log($(this).attr('class'));
  $('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  eraserTool = new Tool();
  eraserTool.onMouseDrag = eraserMouseDrag;
  eraserTool.activate();
}
function eraserMouseDrag(event) {
  var hit = project.hitTest(event.point);
  if(hit) {
    hit.item.remove();
    console.log(hit);
  }
}
