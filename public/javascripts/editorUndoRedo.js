//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorUndo', undo);
$('.sidebar').on('click', '.btnEditorRedo', redo);
//TODO: container for each interaction is needed
/*
- pen add
- text add
- change color
- selection-translation
- selection-scale
- selection-rotation
- selection keep an eye on item sets which were transformed
*/
// interaction container:{action,[action-parameters],undoBool}
// add path:  {addPath,  [JSON],false}                 - done
// add text:  {addText,  [JSON],false}
// translate: {translate,[originalJSON,newJSON],false}
// scale:     {scale,    [originalJSON,newJSON],false}
// rotation:  {rotation, [originalJSON,newJSON],false}
// delete:    {delete,   [JSON],false}
// itemUp:    {itemUp,   [originalJSON,newJSON],false}
// itemDown:  {itemDown, [originalJSON,newJSON],false}
var interaction = new Array();
function undo(event) {
  console.log(interaction);
  //console.log(interaction[0].content[0].id);
  //console.log(interaction[0].undo);
  for(var i=interaction.length-1; i>=0; --i) {
    if(interaction[i].undo == false) {
      undoAction(interaction[i]);
      return;
    }
  }
}
function redo(event) {
  console.log(interaction);
  for(var i=0; i<interaction.length; i++) {
    if(interaction[i].undo == true) {
      redoAction(interaction[i]);
      return;
    }
  }

}

function undoAction(action) {
  action.undo = true;
  if(action.type == "addPath") {
    console.log("undo add path");
    console.log(action.content[0]);
    var path = project.getItems({
      class: Path,
      id: action.content[0]
    });
    path[0].remove();
    console.log(action);
    view.update()
  }
}
function redoAction(action) {
  action.undo = false;
  if(action.type == "addPath") {
    console.log("redo add path");
    //console.log(action.content[1]);
    var p = new Path();
    p.importJSON(action.content[1]);
    //p.id = action.content[0];
    action.content[0] = p.id;
  }
  view.update();
}
function removeAllUndoed() {
  if(interaction.length > 0) {
    while(interaction[interaction.length-1].undo == true) {
      interaction.pop();
    }
  }
}