var usercollection = new Array();
paper.install(window);
var dim = null;
var selectedUser;
var switchUserTimerHandler = null;
var switchUserTime = 20000;
var showMain;

//initial functions
$( document ).ready(function() {
  boardID = location.search.split("BID=")[1];
  if(!boardID) {
    showSelectBoardPopup();
    return;
  }
  getBoard();
  showMain = true;
});

$(window).on("resize", resize);
function resize () {
  //if the view is greater - put the header div at the tablet corner
  if(dim && $(window).width() >= dim.resX) {
    $("#header").css("right",$(window).width()-dim.resX);
  }
  else if(dim && $(window).width() < dim.resX) {
    $("#header").css("right",$(window).width()-dim.resX);
  }
  if(showMain) {
    var sidebarHeight = $(".sidebar").height();
    var sidebarLowerHeight = $("#sidebarMain .sidebarLower").height();
    var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight-20;
    $("#userContainer").css("height",sidebarUpperHeight+"px");
  }
}

function getBoard() {
  $.ajax({
    url:"functions/getBoard",
    type:"GET",
    data:{"boardID":boardID},
    success:function(res) {
      dim = {"resX":res.boardResX,"resY":res.boardResY};
      showBoardResolutionCanvas();
      resize();
      roomID = res.boardRoom;
      if(roomID) getRoomUsers();
      
      //TODO: resize for browser - apply resize for pointer events in the canvas
      /*
      var bSize;
      var wSize;

      if(dim.resX > dim.resY) {
        bSize = dim.resY;
        wSize = $(window).height();
      }
      else {
        bSize = dim.resX;
        wSize = $(window).width();
      }
      var x = (100/bSize)*wSize;

      $("#content").css("zoom",x+"%");
      $("#header").css("zoom",x+"%");
      */
    },
    error:function(err) {
      console.log("couldn't get board resolution");
    }
  });
}

function showBoardResolutionCanvas() {
  //show the resolution Canvas
  //DOM element get because jquery didn't work
  var jSizePrevCanv = $("#tabletSizePreview");
  jSizePrevCanv.attr("width",dim.resX+1);
  jSizePrevCanv.attr("height",dim.resY+1);
  var sizePrevCanvas = document.getElementById("tabletSizePreview");
  var context = sizePrevCanvas.getContext("2d");
  context.beginPath();
  context.moveTo(dim.resX+1,0);
  context.lineTo(dim.resX+1,dim.resY+1);
  context.lineTo(0,dim.resY+1);
  context.stroke();
}

function getRoomUsers() {
  $.ajax({
    url:"/functions/getRoomUsers",
    type:"GET",
    data:{"roomID":roomID},
    success:function(res) {
      usercollection = new Array();
      if(res.length > 0) {
        usercollection = res;
        initRoomDisplay();
      }
      else {
        //else there are no users in this room
        console.log("no users available for this room");
      }
    },
    error:function(err) {
      console.log("couldn't get board users");
    }
  });
}

function initRoomDisplay() {
  initSidebar();
  initHeader();
  initContent();
  show_gifs();
  addGifTicker();
  selectedUser = 0;
  showUser(selectedUser);
}

function initSidebar() {
  var sidebarHeight = $(".sidebar").height();
  var sidebarLowerHeight = $("#sidebarMain .sidebarLower").height();
  var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight-20;


  $("#sidebarMain .sidebarUpper").empty();
  $("#sidebarMain .sidebarUpper").append("<br>");
  $("#sidebarMain .sidebarUpper").append("<div id='userContainer'>");
  $("#userContainer").css("height",sidebarUpperHeight+"px");
  for(var i=0; i<usercollection.length; i++) {
    $("#userContainer").append("<button name='"+i+"' onclick='selectUser("+i+")'>"+usercollection[i].userName);
    //buttonContainer.append("<button name='"+i+"' onclick='selectUser("+i+")'>012345678901234567890123456789");
    $("#userContainer").append("<br>");
  };
}

/*
  var sidebarHeight = $(".sidebar").height();
  var sidebarLowerHeight = $("#sidebarViewMessages .sidebarLower").height();
  var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight;
  var nextSize = 30;
  $("#sidebarViewMessages .sidebarUpper").empty();
  $("#sidebarViewMessages .sidebarUpper").append("<br>");
  $("#sidebarViewMessages .sidebarUpper").append("<div id='messageContainer'>");
  $("#messageContainer").append("<div>");
  $("#messageContainer").css("height",sidebarUpperHeight+"px");
  $("#messageContainer div").css("height",sidebarUpperHeight-55+"px");
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
*/

function selectUser(userIndex) {
  updateTimer();
  selectedUser = userIndex;
  showUser(userIndex);
}

function initHeader() {
  $("#header").empty();
}

function initContent() {
  $("#EditorCanvas").attr("width",dim.resX);
  $("#EditorCanvas").attr("height",dim.resY);
  $("#EditorCanvas").css("width",dim.resX);
  $("#EditorCanvas").css("height",dim.resY);
}

function showUser(userIndex) {
  stopSwitchUserTimer();
  startSwitchUserTimer();
  var buttons = $("#sidebarMain .sidebarUpper button");
  buttons.removeAttr("style");
  buttons.each(function() {
    if($(this).attr("name") == userIndex)
      $(this).css("border","2px solid red");
  });
  showUserHeader(userIndex);
  showUserContent(userIndex);
}

function showUserHeader(userIndex) {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  var imgURL = usercollection[userIndex].userProfilePic;
  if(!imgURL) imgURL = "/images/default-user.png";
  $("#header").append("<div id='userImage'><img src='"+imgURL+"'>");
  if($("#userImage img").width() > $("#userImage img").height()) {
    $("<div id='verticalAlignDiv'>").insertBefore("#userImage img");
    $("#userImage img").css("width","100%");
    $("#verticalAlignDiv").css("height",($("#userImage").height()-$("#userImage img").height())/2);
  }
  else {
    $("#userImage img").css("height","100%");
  }
  $("#userInfo").append("<div id='userName'>"+usercollection[userIndex].userName);
  $("#userInfo").append("<div id='userDescription'>"+usercollection[userIndex].userDescription);
  getUSerStatus(userIndex);
}

function showUserContent(userIndex) {
  project.clear();
  view.update();
  $.ajax({
    url: "/functions/getUserContent",
    type: "GET",
    data: {"userID":usercollection[userIndex].userID},
    success:function(response) {
      project.clear();
      project.importJSON(response.content);
      view.update();
    },
    error:function(error) {
      console.log("couldn't get user content");
    }
  });
  showTwitter(userIndex);
}

function getUSerStatus(userIndex) {
  $.ajax({
    url:"/functions/getUserStatus",
    type:"GET",
    data:{"userID":usercollection[userIndex].userID},
    success:function(res) {
      if(res) {
        var untilDate = moment(res.until);
        var now = moment();
        //var untilDate = new Date(res.until);
        if(untilDate > now) {
          $("#userInfo").append("<hr>");
          $("#userInfo").append("<div id='userStatus'>"+res.text);
          var time = untilDate.format("HH:mm");
          var date = moment(untilDate).format("DD.MM.YYYY");
          //untilString = moment(untilDate).format("HH:mm DD.MM.YYYY");
          $("#userStatus").append("<br><div>until "+time+"<br>"+date);
        }
      }
    },
    error:function(err) {
      console.log("couldn't get user status");
    }
  });
}

//switch between the users
function switchUser() {
  selectedUser = selectedUser+1;
  if(selectedUser > usercollection.length-1) selectedUser = 0
  showUser(selectedUser);
}

function startSwitchUserTimer() {
  clearTimeout(switchUserTimerHandler);
  switchUserTimerHandler = setTimeout(switchUser,switchUserTime);
}

function stopSwitchUserTimer() {
  clearTimeout(switchUserTimerHandler);
}

function showSelectBoardPopup() {
  $("body").empty();
  showPopup();
  $("#popupBackground1").unbind();
  $("#popup").append("<h2>No Board Selected");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Select a Board to Display");
  $("#popup").append("<div id='boardOptions'>");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='selectBoard()'>Select");
  $.ajax({
    url:"functions/getBoards",
    type:"GET",
    success:function(res) {
      if(res) {
        $("#boardOptions").append("<select>");
        res.forEach(function(key) {
          var board = "Board "+key.id;
          var room;
          if(!key.room) room = "";
          else room = " - Room "+key.room;
          $("#boardOptions select").append("<option value='"+key.id+"'>"+board+room);
        });
      }
      else {
        $("#popup").append("No Boards available!");
      }
    },
    error:function(err) {
      console.log("couldn't get boards");
    }
  });
}

function selectBoard() {
  var selected = $("#boardOptions select").val();
  window.location.href = "/?BID="+selected;
}

function showTwitter(userIndex) {
  //console.log(usercollection[userIndex].userTwitter);
  //var yourRawJSONData;
  //$("#twitterDiv").remove();
  //$("body").append("<div id='twitterDiv' style='z-index: 40; position:absolute; left:0; top:0; width:200px; height:100px'>");
  /*$("#twitterDiv").remove();
  $("body").append("<div id='twitterDiv' style='z-index: 40; position:absolute; left:0; top:0; width:200px; height:100px'>");
  $.ajax({
    type:"GET",
    url:"https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=AndreKarge&count=1",
    dataType:"jsonp",
    success: function(res) {
      console.log(res);
    },
    error:function(err) {
      console.log(err);
    }
  });*/
}