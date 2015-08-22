//set up the global paper scope
paper.install(window);
//button click listener
$('.sidebar').on('click', '.btnEditorUndo', undo);
$('.sidebar').on('click', '.btnEditorRedo', redo);
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
// add path:  {addPath,  [id,JSON],false}                 - done
// add text:  {addText,  [id,JSON],false}                 - done
// translate: {translate,[id,originalJSON,newJSON],false}
// scale:     {scale,    [id,originalJSON,newJSON],false}
// rotation:  {rotation, [id,originalJSON,newJSON],false}
// delete:    {delete,   [id,JSON],false}
// itemUp:    {itemUp,   [id,originalJSON,newJSON],false}
// itemDown:  {itemDown, [id,originalJSON,newJSON],false}
// copy:      {copy,     [id,JSON],false}
var interaction = new Array();
function undo(event) {
  console.log(interaction);
  if(interaction.length > 0) {
    for(var i=interaction.length-1; i>=0; --i) {
      if(interaction[i].undo == false) {
        undoAction(interaction[i]);
        return;
      }
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
  removeSelectionPopup();
  removeBoundingBox();
  project.deselectAll();
  switch(action.type) {
    case "addPath":
      console.log("undo add path");
      var path = project.getItems({
        class: Path,
        id: action.content[0]
      });
      path[0].remove();
      break;
    case "addText":
      console.log("undo add text");
      var text = project.getItems({
        class: PointText,
        id: action.content[0]
      });
      text[0].remove();
      break;
    case "translate":
      console.log("undo translate objects");
      action.content.forEach(function(key) {
        var item = project.getItems({
          id: key[0]
        });
        item[0].remove();
        var itemUndo = new Path();
        itemUndo.importJSON(key[1]);
        key[0] = itemUndo.id;
      });
      break;
  };
  view.update();
}
function redoAction(action) {
  action.undo = false;
  removeSelectionPopup();
  removeBoundingBox();
  project.deselectAll();
  switch(action.type){
    case "addPath":
      console.log("redo add path");
      var p = new Path();
      p.importJSON(action.content[1]);
      action.content[0] = p.id;
      break;
    case "addText":
      console.log("redo add text");
      var t = new PointText();
      t.importJSON(action.content[1]);
      action.content[0] = t.id;
      break;
  };
  view.update();
}
function removeAllUndoed() {
  if(interaction.length > 0) {
    while(interaction[interaction.length-1].undo == true) {
      interaction.pop();
    }
  }
}