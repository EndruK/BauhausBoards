//set up the global paper scope
paper.install(window);

/* Fixed Queue implementation
 * Ben Nadel
 * http://www.bennadel.com/blog/2308-creating-a-fixed-length-queue-in-javascript-using-arrays.htm
 * 
 * Undo functions
 * by Errol Wood
 * Smartboards2 project
 * https://github.com/errollw/smartboards2
 * 
 */
function FixedQueue(e,t){t=t||[];var n=Array.apply(null,t);n.fixedSize=e;n.push=FixedQueue.push;n.splice=FixedQueue.splice;n.unshift=FixedQueue.unshift;FixedQueue.trimTail.call(n);return n}FixedQueue.trimHead=function(){if(this.length<=this.fixedSize){return}Array.prototype.splice.call(this,0,this.length-this.fixedSize)};FixedQueue.trimTail=function(){if(this.length<=this.fixedSize){return}Array.prototype.splice.call(this,this.fixedSize,this.length-this.fixedSize)};FixedQueue.wrapMethod=function(e,t){var n=function(){var n=Array.prototype[e];var r=n.apply(this,arguments);t.call(this);return r};return n};FixedQueue.push=FixedQueue.wrapMethod("push",FixedQueue.trimHead);FixedQueue.splice=FixedQueue.wrapMethod("splice",FixedQueue.trimTail);FixedQueue.unshift=FixedQueue.wrapMethod("unshift",FixedQueue.trimTail);
var undo_stackLength = 20;
var undo_undoStack = FixedQueue(undo_stackLength);
var undo_redoStack = FixedQueue(undo_stackLength);
var undo_saveState, undo_performUndo, undo_performRedo, undo_updateButtons, tidyJSONProject;
$(function() {
  tidyJSONProject = function (input) {
    if (input.length > 0) {
      var els = input[0][1].children;
      if (input[0][1].selected) {
        delete input[0][1].selected;
      }
      if (els) {
        var len = els.length;
        while (len--) { // go backwards through array because we are deleting elements from it
          var theEl = els[len];
          if (theEl[0] == "Shape") { // remove Shapes - they are the selection boxes
            els.splice(len,1);
          } else if (theEl[0] == "Path" && (typeof theEl[1].segments == "undefined" || theEl[1].segments.length <= 1)) { // remove paths with one or fewer points
            els.splice(len,1);
          } else if (theEl[1].selected) { // deselect everything in the exported JSON
            delete theEl[1].selected;
          }
        }
      }
    }
    return input;
  };
  undo_saveState = function() {
    var newState = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
    var prevState =  undo_undoStack.pop();
    if (typeof prevState != "undefined") { // was there even a previous state?
      if (prevState != newState) { // only add a state if there has been a change
        undo_undoStack.push(prevState);
        undo_undoStack.push(newState);
        
        // Clear the redo-stack
        undo_redoStack = new FixedQueue(undo_stackLength);
      } else {
         undo_undoStack.push(prevState);
      }
    } else {
      undo_undoStack.push(newState);
      // Clear the redo-stack
      undo_redoStack = new FixedQueue(undo_stackLength);
    }
    undo_updateButtons();
  };
  undo_performUndo = function() {
    var lastState =  undo_undoStack.pop();
    if (lastState) { // Only attempt to undo if there is actually an undo state
      var current = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
      if (lastState != current) { // Only undo if the previous state is different
        project.clear();
        project.importJSON(lastState);
        removeSelectionPopup();
        removeBoundingBox();
        view.update();
        // Save 'current' state to redo stack
        undo_redoStack.push(current);
      } else {
         undo_performUndo(); // previous state is no different, so try undoing again
      }
    } else {
    }
    undo_updateButtons();
  };
  undo_performRedo = function() {
    var nextState =  undo_redoStack.pop();
    if (nextState) { // Only attempt to undo if there is actually an undo state
      var current = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
      if (nextState != current) { // Only undo if the previous state is different
        project.clear();
        project.importJSON(nextState);
        removeSelectionPopup();
        removeBoundingBox();
        view.update();
        // Save 'current' state to undo stack
        undo_undoStack.push(current);
      } else {
         undo_performRedo(); // previous state is no different, so try undoing again
      }
    } else {
    }
    undo_updateButtons();
  };

  undo_updateButtons = function() {
    /*var btn = $("div.button#undo");
    var isVisible = btn.css("background-image").indexOf("enabled") > -1;
    if (isVisible && undo_undoStack.length == 0) {
      btn.css({"background-image":'url("assets/icon_undo-disabled.svg")'});
    } else if (!isVisible && undo_undoStack.length > 0) {
      btn.css({"background-image":'url("assets/icon_undo-enabled.svg")'});
    }
    // TODO: Add redo button code
    var btn = $("div.button#redo");
    var isVisible = btn.css("background-image").indexOf("enabled") > -1;
    if (isVisible && undo_redoStack.length == 0) {
      btn.css({"background-image":'url("assets/icon_redo-disabled.svg")'});
    } else if (!isVisible && undo_redoStack.length > 0) {
      btn.css({"background-image":'url("assets/icon_redo-enabled.svg")'});
    }*/
  };

  $(document).on("mousedown touchstart", function(event) {
    // Ignore clicks on the controls (but do pay attention to floatie clicks as these can change the board)
    
    var target = $(event.target);
    var onMessageSidebar = target.parents(".sidebarUpper").parents("#sidebarCreateMessage").length > 0;
    //TODO: handle the bounding box stuff
    var onCanvas = target.attr("id") == "EditorCanvas";
    if(onCanvas) {
      undo_saveState();
    }

    /*if ($(event.target).attr(id) == "EditorCanvas".parents("#controls").length == 0) {
      undo_saveState();
    }*/
  });
  /* Bind to undo button in controls
   */
  $(".sidebar").on("click", '.btnEditorUndo', undo_performUndo);
  
  /* Bind to redo button in controls
   */
  $(".sidebar").on("click", '.btnEditorRedo', undo_performRedo);
});
//button click listener
//$('.sidebar').on('click', '.btnEditorUndo', undo);
//$('.sidebar').on('click', '.btnEditorRedo', redo);
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
// NEW IDEA:
// save the global state of the project when the user presses on the board
// maybe this is a little bit more resource consuming ... 
