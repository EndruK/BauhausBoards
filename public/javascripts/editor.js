//set up the global paper scope
paper.install(window);
$('.sidebar').on('click', '.btnEditorEraser', doClick);
$('.sidebar').on('click', '.btnEditorColor', doClick);
$('.sidebar').on('click', '.btnEditorUndo', doClick);
$('.sidebar').on('click', '.btnEditorRedo', doClick);
$('.sidebar').on('click', '.btnSubmitMessage', submitMessage);
$('.sidebar').on('click', '#askToLeave', askToLeave);
$(document).ready(function() {
  //get the editor canvas
  paper.setup('EditorCanvas');
});

function doClick(event) {}
function submitMessage() {
  project.deselectAll();
  removeBoundingBox();
  removeSelectionPopup();
  console.log(project.exportJSON());
}

//function to remove all active listeners
function removeListeners() {
  penTool.remove();
  textTool.remove();
  selectorTool.remove();
  eraserTool.remove();
  deactivateSelector();
}
function addImageDropLayer() {
  var wrapper = $("#wrapper");
  var imageDropLayer = wrapper.append("<div id='imageDropLayer'>");
  imageDropLayer.on("dragenter",drag);
  imageDropLayer.on("dragexit",drag);
  imageDropLayer.on("dragover",drag);
  imageDropLayer.on("drop",drop);
}
function removeImageDropLayer() {
  var imageDropLayer = $("#imageDropLayer");
  imageDropLayer.remove();
}
function askToLeave(event) {
  var input = confirm("Do you really want to discard your message?");
  if(input) {
    loadMessageLanding();
  }
}