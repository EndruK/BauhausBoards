//set up the global paper scope
paper.install(window);
$('.sidebar').on('click', '.btnEditorEraser', doClick);
$('.sidebar').on('click', '.btnEditorColor', doClick);
$('.sidebar').on('click', '.btnEditorUndo', doClick);
$('.sidebar').on('click', '.btnEditorRedo', doClick);
$('.sidebar').on('click', '.btnSubmitMessage', submitMessage);
$(document).ready(function() {
  //get the editor canvas
  paper.setup('EditorCanvas');
});

function doClick(event) {}
function submitMessage() {
  console.log(project.exportJSON());
}

//function to remove all active listeners
function removeListeners() {
  penTool.remove();
  textTool.remove();
  selectorTool.remove();
  deactivateSelector();
}