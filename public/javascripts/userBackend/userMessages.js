var messagePage;
var messages;

var maxMessages = 10;
var maxpages;
var showMessages;

$(window).on("resize",function() {
  if(showMessages) {
    displayMessages();
  }
});

function loadViewMessages(event) {
  //$('#header').text('View Messages');
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
  messagePage = 0;
  messages = new Array();
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
    }
  });
}

function displayMessages() {
  if(messagePage < 0) messagePage = 0;
  if(messagePage > maxpages) messagePage = maxpages;
  showMessages = true;
  var sidebarHeight = $(".sidebar").height();
  var sidebarLowerHeight = $("#sidebarViewMessages .sidebarLower").height();
  var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight;
  var nextSize = 30;
  $("#sidebarViewMessages .sidebarUpper").empty();
  $("#sidebarViewMessages .sidebarUpper").append("<div id='messageContainer'>");
  $("#messageContainer").append("<div>");
  $("#messageContainer").css("height",sidebarUpperHeight+"px");
  $("#messageContainer div").css("height",sidebarUpperHeight-30+"px");
  $("#messageContainer").append("<button onclick='{messagePage--; displayMessages();}'><");
  $("#messageContainer").append("<button onclick='{messagePage++; displayMessages();}'>>");
  for(var i=(messagePage*maxMessages); i<((messagePage+1)*maxMessages); i++) {
    if(i == messages.length) break;
    $("#messageContainer div").append("<button value='"+i+"' onclick='showMessage("+i+")'>"+messages[i].date);
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
    messages[messageIndex].seen = 1;
  }

  if(messages[messageIndex].seen == 0) {
    $.ajax({
      url:"/functions/markMessageSeen",
      type:"POST",
      data:{"messageID":messages[messageIndex].messageID},
      error:function(err) {
        console.log("couldn't mark message as seen");
      }
    });
  }
  updateTimer();
  console.log(messages);
  project.clear();
  project.importJSON(messages[messageIndex].content);
  view.update();
}