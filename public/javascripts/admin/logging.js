paper.install(window);
var contents;
var feedbacks;
var messages;
function loadLogging(event) {
  var content = $("#content");
  content.empty();
  content.append("<h2>Logging");
  $("#back").remove();
  $("body").append("<div title='Back' id='back' class='containerTile containerTileAbs secondAbsTile'><span class='glyphicon glyphicon-backward'>");
  $("#back").on("click", function() {
    $("#back").remove();
    showSettings();
    removePopup();
    $("#background").remove();
    $('#EditorCanvas').css('visibility','hidden');
    removeAllGifs();
    hide_gifs();
  });
  content.append("<button onclick='loadContentLogs()'>Content Logs<br>");
  content.append("<button onclick='loadMessageLogs()'>Message Logs<br>");
  content.append("<button onclick='loadFeedbackLogs()'>Feedback Logs");

}

function loadContentLogs(event) {
  initSubpage("Content Logs");
  $.ajax({
    url:"/functions/getUsers",
    type:"GET",
    success:function(res) {
      $("#content").append("<select id='userSelect' onChange='loadUserContent()'><br><br>");
      $("#userSelect").append("<option value='' selected>");
      res.forEach(function(key) {
        $("#userSelect").append("<option value='"+key.userID+"'>"+key.userName);
      });
    },
    error:function(err) {
      console.log("couldn't get users");
    }
  });
}

function loadUserContent() {
  var selected = $("#userSelect option:selected").val();
  contents = new Array();
  if(!selected) return;
  //console.log(selected);
  $.ajax({
    url:"/functions/getAllUserContent",
    type:"GET",
    data:{"userID":selected},
    success:function(res) {
      contents = res;
      $("#contentSelect").remove();
      $("#content br:last").remove();
      $("#content").append("<br><select id='contentSelect' onChange='loadContentCanvas()'>");
      $("#contentSelect").append("<option value='' selected>");
      res.forEach(function(key) {
        $("#contentSelect").append("<option value='"+key.c_id+"'>"+moment(key.c_date).format("YYYY-MM-DD HH:mm").toString());
      });
    },
    error:function(err) {
      console.log("couldn't get all user content");
    }
  });
}

function loadContentCanvas() {
  var selected = $("#contentSelect option:selected").val();
  if(!selected) {
    $("#EditorCanvas").css("visibility","hidden");
    return;
  }
  contents.forEach(function(key) {
    if(key.c_id == selected) {
      console.log(key.c_contentJSON);
      showContent(key.c_contentJSON,key.c_background);
      return;
    }
  });
  view.update();
}

function loadMessageLogs(event) {
  messages = new Array();
  initSubpage("Message Logs");
  $.ajax({
    url:"/functions/getAllMessages",
    type:"GET",
    success:function(res) {
      console.log(res);
      messages = res;
      $("#content").append("<select id='messageSelect' onChange='loadMessageContent()'><br><br>");
      $("#messageSelect").append("<option value='' selected>");
      res.forEach(function(key) {
        $("#messageSelect").append("<option value='"+key.m_id+"'>"+moment(key.m_date).format("YYYY-MM-DD HH:mm").toString());
      });
    },
    error:function(err) {
      console.log("couldn't get messages");
    }
  });
}

function loadMessageContent() {
  var selected = $("#messageSelect option:selected").val();
  if(!selected) {
    $("#EditorCanvas").css("visibility","hidden");
    return;
  }
  messages.forEach(function(key) {
    if(key.m_id == selected) {
      console.log(key.m_contentJSON);
      showContent(key.m_contentJSON);
      return;
    }
  });
  view.update();
}

function loadFeedbackLogs(event) {
  feedbacks = new Array();
  initSubpage("Feedback Logs");
  $.ajax({
    url:"/functions/getFeedback",
    type:"GET",
    success:function(res) {
      feedbacks = res;
      console.log(res);
      $("#content").append("<select id='feedbackSelect' onChange='loadFeedbackContent()'><br><br>");
      $("#feedbackSelect").append("<option value='' selected>");
      res.forEach(function(key) {
        $("#feedbackSelect").append("<option value='"+key.f_id+"'>"+moment(key.f_date).format("YYYY-MM-DD HH:mm").toString());
      });
    },
    error:function(err) {
      console.log("couldn't get feedback");
    }
  });
}

function loadFeedbackContent() {
  var selected = $("#feedbackSelect option:selected").val();
  if(!selected) {
    $("#EditorCanvas").css("visibility","hidden");
    return;
  }
  feedbacks.forEach(function(key) {
    if(key.f_id == selected) {
      console.log(key.f_content);
      showContent(key.f_content);
      return;
    }
  });
  view.update();
}

function initSubpage(title) {
  var content = $("#content");
  content.empty();
  content.append("<h2>"+title);
  $("#back").on("click", function() {
    loadLogging();
    removePopup();
  });
}

function showContent(content,background) {
  $("#EditorCanvas").css({"visibility":"visible"});
  $("#EditorCanvas").attr("width",$(window).width());
  $("#EditorCanvas").attr("height",$(window).height());
  $("#EditorCanvas").css("width",$(window).width());
  $("#EditorCanvas").css("height",$(window).height());
  project.clear();
  project.importJSON(content);
  view.update();
  if(background) showBackground(background);
  $("#gifLayer").css({
    "width":$("#EditorCanvas").width(),
    "height":$("#EditorCanvas").height(),
    "top":$("#logo").height()+$("#content").height()+30
  });
  show_gifs();
  addGifTicker();
}

function showBackground(background) {

  $("#background").remove();
  var url = background;
  if(!url) return;
  $("body").append("<iframe id='background' scrolling='no' src='"+url+"'>");
  $("#background").css({
    "width":$("#EditorCanvas").width(),
    "height":$("#EditorCanvas").height(),
    "top":$("#logo").height()+$("#content").height()+30
  });
}