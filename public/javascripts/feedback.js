function loadFeedback(event) {
  
  showSidebar('sidebarFeedback');
  updateTimer();
  showFeedbackHeader();
  strokeSize = 1;
  setSidebarStrokeButtonClass("minStroke");
  stopSwitchUserTimer();
  removePopup();
  undo_undoStack = FixedQueue(undo_stackLength);
  undo_redoStack = FixedQueue(undo_stackLength);
  paper.setup('EditorCanvas');
  activeColor = colors["black"];
  openSidebar();
  addImageDropLayer();
  show_gifs();
  removeAllGifs();
  updateTimer();
  activatePenTool();
  project.clear();
  view.update();
  $('#tabletSizePreview').css('visibility','visible');
  startMessageTimer();
  switchButtonColor();
}

function showFeedbackHeader() {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  $("#userInfo").append("<div id='userName'>Give some Feedback");
  $("#userInfo").append("<div id='userDescription'>");
  $("#header").append("<div id='userImage'>")
  $("#userImage").append("<span class='glyphicon'>");
  showIcon("pen");
}