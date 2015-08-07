//set up the global paper scope
paper.install(window);
var selectedMethod = 'btnEditorSelector';
var path;
$('.sidebar').on('click', '.btnEditorSelector', doClick);
$('.sidebar').on('click', '.btnEditorPen', doClick);
$('.sidebar').on('click', '.btnEditorText', doClick);
$('.sidebar').on('click', '.btnEditorEraser', doClick);
$('.sidebar').on('click', '.btnEditorStrokeSize', doClick);
$('.sidebar').on('click', '.btnEditorColor', doClick);
$('.sidebar').on('click', '.btnEditorUndo', doClick);
$('.sidebar').on('click', '.btnEditorRedo', doClick);
$(document).ready(function() {
  //get the editor canvas
  paper.setup('EditorCanvas');
  var tool = new Tool();
  //add mouse listeners
  tool.onMouseDown = penMouseDown;
  tool.onMouseDrag = penMouseDrag;
  tool.onMouseUp   = penMosueUp;
});

function penMouseDown(event) {
  //only execute if pen mode activated
  if(selectedMethod != 'btnEditorPen')
    return;
  path = new Path();
  path.strokeColor = 'black';
  drag = true;
}

function penMouseDrag(event) {
  //only execute if pen mode activated
  if(selectedMethod != 'btnEditorPen')
    return;
  path.add(event.point);
}

function penMosueUp(event) {
  //only execute if pen mode activated
  if(selectedMethod != 'btnEditorPen')
    return;
  drag = false;
  path.simplify();
}

function doClick(event) {
  selectedMethod = $(this).attr('class');
  updateTimer();
}