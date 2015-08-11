//set up the global paper scope
paper.install(window);
var path;
var selectorTool;
var penTool;
var textTool;
$('.sidebar').on('click', '.btnEditorEraser', doClick);
$('.sidebar').on('click', '.btnEditorColor', doClick);
$('.sidebar').on('click', '.btnEditorUndo', doClick);
$('.sidebar').on('click', '.btnEditorRedo', doClick);
$(document).ready(function() {
  //get the editor canvas
  paper.setup('EditorCanvas');
});

function doClick(event) {}

//function to remove all active listeners
function removeListeners() {
  penTool.remove();
  textTool.remove();
  selectorTool.remove();
}