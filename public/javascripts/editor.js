//set up the global paper scope
paper.install(window);
var selectedMethod = 'btnEditorSelector';
var path;
var penTool;
var textTool;
$('.sidebar').on('click', '.btnEditorSelector', doClick);
$('.sidebar').on('click', '.btnEditorPen', activatePen);
$('.sidebar').on('click', '.btnEditorText', activateText);
$('.sidebar').on('click', '.btnEditorEraser', doClick);
$('.sidebar').on('click', '.btnEditorStrokeSize', doClick);
$('.sidebar').on('click', '.btnEditorColor', doClick);
$('.sidebar').on('click', '.btnEditorUndo', doClick);
$('.sidebar').on('click', '.btnEditorRedo', doClick);
$(document).ready(function() {
  //get the editor canvas
  paper.setup('EditorCanvas');
  penTool = new Tool();
  textTool = new Tool();
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
function activatePen(event) {
  removeListeners();
  penTool = new Tool();
  selectedMethod = $(this).attr('class');
  console.log(selectedMethod);
  //set up he mouse listeners
  penTool.onMouseDown = penMouseDown;
  penTool.onMouseDrag = penMouseDrag;
  penTool.onMouseUp   = penMosueUp;
  penTool.activate();
}
function activateText(event) {
  removeListeners();
  textTool = new Tool();
  selectedMethod = $(this).attr('class');
  console.log(selectedMethod);
  textTool = new Tool();
  textTool.onMouseUp = makeText;
  textTool.activate();
}
function makeText(event) {
  console.log('texteditor');
  var input = prompt("Enter a text:");
  if(input) {
    console.log(input);
    var text = new PointText(event.point);
    text.fillColor = 'black';
    text.content = input;
  }
  //console.log(event);
}
function removeListeners() {
  penTool.remove();
  textTool.remove();
}