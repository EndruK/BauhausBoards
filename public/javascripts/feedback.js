$('.sidebar').on('click', '.btnSubmitFeedback', submitFeedback);

function loadFeedback(event) {
  showSidebar('sidebarFeedback');
  $("#sidebarFeedback .sidebarUpper").css("color","black");
  updateTimer();
  showFeedbackHeader();
  strokeSize = 1;
  setSidebarStrokeButtonClass("minStroke");
  stopSwitchUserTimer();
  removePopup();
  paper.setup('EditorCanvas');
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
  $('#EditorCanvas').css('visibility','visible');
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

function submitFeedback() {
  var message = project.exportJSON();
  if(JSON.parse(message).length > 0) {
    $.ajax({
      url:"/functions/feedback",
      type:"POST",
      data:{"content":message},
      success:function(res) {
        showFloaty("Thanks for the feedback :)");
        closeSidebar();
        loadMain();
      },
      error:function(err) {
        console.log("could not submit feedback");
      }
    });
  }
  else {
    showFloaty("Message is empty!");
  }
}