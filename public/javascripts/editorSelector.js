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
var selectionPath = null;
var selectionRect = null;

function selectorMouseDown(event) {
  var hit = project.hitTest(event.point);
  //console.log(hit);
  // if no hit
  project.deselectAll();
  if(!hit) {
    if(selectionPath != null) {
      selectionPath.remove();
      selectionPath = null;
    }
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
    var pathItems = project.getItems({
      position: testPos,
      class: Path
    });
    for (var i = 0; i < pathItems.length; ++i) {
      //console.log(items[i]);
      pathItems[i].selected = true;
    }
    //console.log(paths);
    selectionPath.remove();
  }
  console.log(selectionPath);
  console.log(selectionRect);
}
function testPos(pos) {
  return selectionPath.bounds.contains(pos);
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