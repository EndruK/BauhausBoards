var messagePage;
var messages;

var maxMessages = 8;
var maxpages;
var showMessages;

$(window).on("resize",function() {
  if(showMessages) {
    displayMessages();
  }
});

function loadViewMessages(event) {
  $("#sidebarViewMessages .sidebarUpper").empty();
  messagePage = 0;
  messages = new Array();
  showSidebar('sidebarViewMessages');
  updateTimer();

  $('#header').empty();
  $("#header").append("<div id='userInfo'>");
  $("#userInfo").append("<div id='userName'>Messages");
  $("#userInfo").append("<div id='userDescription'>");
  project.clear();
  view.update();
  $('#EditorCanvas').css('visibility','visible');
  $('#tabletSizePreview').css('visibility','visible');
  
  loadMessages();
}

function loadMessages() {
  $.ajax({
    url:"/functions/getUserMessages",
    type:"GET",
    success:function(res) {
      messages = res;
      maxpages = Math.ceil(messages.length/maxMessages)-1;
      displayMessages();
    },
    error:function(err) {
      console.log("couldn't get user messages");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function displayMessages() {
  updateTimer();
  if(messagePage < 0) messagePage = 0;
  if(messagePage > maxpages) messagePage = maxpages;
  showMessages = true;
  var sidebarHeight = $(".sidebar").height();
  var sidebarLowerHeight = $("#sidebarViewMessages .sidebarLower").height();
  var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight;
  var nextSize = 30;
  $("#sidebarViewMessages .sidebarUpper").empty();
  $("#sidebarViewMessages .sidebarUpper").append("<br>");
  $("#sidebarViewMessages .sidebarUpper").append("<div id='messageContainer'>");
  $("#messageContainer").append("<div>");
  $("#messageContainer").css("height",sidebarUpperHeight+"px");
  $("#messageContainer div").css("height",sidebarUpperHeight-85+"px");
  if(messagePage != 0) $("#messageContainer").append("<button style='width:40%' onclick='{messagePage--; displayMessages();}'><");
  if(messagePage != maxpages) $("#messageContainer").append("<button style='width:40%' class='nextPrevBtn' onclick='{messagePage++; displayMessages();}'>>");
  for(var i=(messagePage*maxMessages); i<((messagePage+1)*maxMessages); i++) {
    if(i == messages.length) break;
    $("#messageContainer div").append("<button value='"+i+"' onclick='showMessage("+i+")'>"+moment(messages[i].date).format("YYYY-MM-DD HH:mm"));
    if(messages[i].seen == 0) {
      $("#messageContainer div button:last").attr("style","border:solid 2px red;");
    }
    if(((messagePage+1)*maxMessages)-1 != i) {
      $("#messageContainer div").append("<br>");
    }
  }
}

function showMessage(messageIndex) {
  if(messages[messageIndex].seen == 0) {
    $("#messageContainer div button").each(function() {
      if($(this).val() == messageIndex) {
        $(this).removeAttr("style");
        return;
      }
    });
    $.ajax({
      url:"/functions/markMessageSeen",
      type:"POST",
      data:{"messageID":messages[messageIndex].messageID},
      success:function(res) {
        messages[messageIndex].seen = 1;
      },
      error:function(err) {
        console.log("couldn't mark message as seen");
        showFloaty("no connection");
      },
      timeout: ajaxTimeout
    });
  }
  updateTimer();
  project.clear();
  project.importJSON(messages[messageIndex].content);
  view.update();
  $("#userDescription").empty();
  $("#userDescription").append(moment(messages[messageIndex].date).format("HH:mm"));
  $("#userDescription").append("<br>"+moment(messages[messageIndex].date).format("YYYY-MM-DD"));
  $("#userDescription").append("<br><button onclick='markMessageUnseen("+messageIndex+")'>Mark as unseen");
}

function markMessageUnseen(messageIndex) {
  if(messages[messageIndex].seen == 1) {
    $("#messageContainer div button").each(function() {
      if($(this).val() == messageIndex) {
        $(this).attr("style","border:solid 2px red;");
      }
    });
    $.ajax({
      url:"/functions/markMessageUnseen",
      type:"POST",
      data:{"messageID":messages[messageIndex].messageID},
      success:function(res) {
        messages[messageIndex].seen = 0;
      },
      error:function(err) {
        console.log("couldn't mark message as unseen");
        showFloaty("no connection");
      },
      timeout: ajaxTimeout
    });
  }
}