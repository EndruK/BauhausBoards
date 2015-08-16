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
}

function selectorMouseDown(event) {
  //console.log("selector mouse down");
  var hit = project.hitTest(event.point);
  console.log(hit);
  // if no hit
  if(!hit) {
    project.deselectAll();
  }
  else {
    //console.log(hit);
    hit.item.selected = true;
  }
}
function selectorMouseUp(event) {
  //console.log("selector mouse up");
}
function selectorMouseMove(event) {
  //console.log("selector mouse move");
}