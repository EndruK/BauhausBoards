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
  if(selectionPath != null) {
    selectionPath.remove();
  }
}
function selectorMouseUp(event) {
  if(selectionPath != null) {
    var items = project.getItems({
      overlapping: selectionRect
    });
    for (var i = 0; i < items.length; ++i) {
      console.log(items[i]);
      items[i].selected = true;
    }
    //console.log(items);
    selectionPath.remove();
  }
}
function selectorMouseMove(event) {

}
function selectorMouseDrag(event) {
  selectionRect = new Rectangle(mousePoint,event.point);
  if(selectionPath != null) {
    selectionPath.remove();
  }
  selectionPath = new Shape.Rectangle(selectionRect);
  selectionPath.strokeColor = "black";
  selectionPath.fillColor = "black";
  selectionPath.fillColor.alpha = 0.1;
  selectionPath.dashArray = [10,12];
}
function deactivateSelector() {
  if(selectionPath != null) {
    selectionPath.remove();
    view.update();
  }
}