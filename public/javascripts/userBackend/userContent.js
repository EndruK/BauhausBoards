$(".btnSubmitChangeContent").on("click",changeContent);
var background;

function loadChangeContent(event) {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  $("#userInfo").append("<div id='userName'> Change Content");
  showSidebar('sidebarChangeContent');
  closeSidebar();
  view.update();
  $('#EditorCanvas').css('visibility','visible');
  $('#tabletSizePreview').css('visibility','visible');
  show_gifs();
  addGifTicker();
  undo_undoStack = FixedQueue(undo_stackLength);
  undo_redoStack = FixedQueue(undo_stackLength);
  paper.setup('EditorCanvas');
  activatePenTool();
  activeColor = colors["black"];
  addImageDropLayer();
  $.ajax({
    url: "/functions/getUserContent",
    type: "GET",
    data: {"userID":authenticatedUser},
    success:function(response) {
      if(response) {
        background = response.background;
        project.clear();
        project.importJSON(response.content);
      }
    },
    error:function(error) {
      console.log("couldn't get user content");
    }
  });
}

function changeContent(event) {
  //TODO: show popup
  var contentJSON = project.exportJSON();
  var background = "";
  $.ajax({
    url:"functions/changeUserContent",
    type:"POST",
    data:{"userID":authenticatedUser,"content":contentJSON,"background":background},
    success:function(res) {
      console.log(res);
    },
    error:function(err) {
      console.log("couldn't set user content");
    }
  });
}