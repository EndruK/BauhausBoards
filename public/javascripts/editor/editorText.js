//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorText', activateTextTool);
var textTool;
$(document).ready(function() {
  //initialize the text event handler tool
  textTool = new Tool();
});
function activateTextTool(event) {
  console.log($(this).attr('class'));
  //$('#header').text($(this).attr('class'));
  updateTimer();
  removeListeners();
  textTool = new Tool();
  textTool = new Tool();
  textTool.onMouseUp = drawText;
  textTool.activate();
}
function drawText(event) {
  console.log('texteditor');
  var input = prompt("Enter a text:");
  //only make a text if the user entered some text
  if(input) {
    console.log(input);
    var text = new PointText(event.point);
    text.fillColor = rgbToHex(activeColor);
    text.fontFamily = 'Arial';
    text.fontSize = '20px';
    text.content = input;
  }
}