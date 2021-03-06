var usercollection = new Array();
paper.install(window);
var dim = null;
var selectedUser;
var switchUserTimerHandler = null;
var switchUserTime = 20000;
var showMain;
var twitterAjax;
var twitterEmbedAjax;
var ajaxTimeout = 5000;
var oldContent = new Array();
var oldStatus = new Array();
var oldAvailableStatus = new Array();

//initial functions
$( document ).ready(function() {
  boardID = location.search.split("BID=")[1];
  if(!boardID) {
    showSelectBoardPopup();
    return;
  }
  getBoard();
  showMain = true;
  addSidebarArrow();
});

$(window).on("resize", resize);

function resize () {
  $(".sidebar").css("height","100%");
  //put the header div at the top right corner
  //put the twitter div at bottom right corner
  $("#header").css("right",$(window).width()-dim.resX);
  $("#twitterDiv").css("right",$(window).width()-dim.resX);
  $("#twitterDiv").css("bottom",$(window).height()-dim.resY);
  if(showMain) {
    var sidebarHeight = $(".sidebar").height();
    var sidebarLowerHeight = $("#sidebarMain .sidebarLower").height();
    var sidebarUpperHeight = sidebarHeight-sidebarLowerHeight-20;
    $("#userContainer").css("height",sidebarUpperHeight+"px");
  }
  addSidebarArrow();
}

function addSidebarArrow() {
  $(".sidebarSwiper").empty();
  $(".sidebarSwiper").append("<div class='sidebarArrowSpacer'>");
  $(".sidebarSwiper").append("<div class='sidebarArrow'>")
  if(sidebarStatus) {
    $(".sidebarArrow").append("<span class='glyphicon glyphicon-menu-left'>");
  }
  else {
    $(".sidebarArrow").append("<span class='glyphicon glyphicon-menu-right'>");
  }
  $(".sidebarArrow span").css("font-size","35px");
  $(".sidebarArrowSpacer").css("height",$(".sidebarSwiper").height()/2 - $(".sidebarArrow").height()/2);
}

function getBoard() {
  console.log(usercollection);
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
    },
    timeout: ajaxTimeout
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
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

function selectUser(userIndex) {
  $('#twitterDiv').remove();
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
  $("#gifLayer").css({"width":dim.resX,"height":dim.resY});
  
}

function showUser(userIndex) {
  //stopSwitchUserTimer();
  startSwitchUserTimer();
  var buttons = $("#sidebarMain .sidebarUpper button");
  buttons.removeAttr("style");
  buttons.each(function() {
    if($(this).attr("name") == userIndex) 
      $(this).css("border","2px solid white");
  });
  reloadUserImage(userIndex);
  showUserHeader(userIndex);
  showUserContent(userIndex);
  showUserBackground(userIndex);
}

function reloadUserImage(userIndex) {
  var userID = usercollection[userIndex].userID;
  $.ajax({
    url: "/functions/getUserImage",
    type: "GET",
    data: {"userID":userID},
    success: function(res) {
      console.log(res);
      usercollection[userIndex].userProfilePic = res.userImage;
    },
    error: function(err) {
      console.log("couldn't get user image");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function showUserHeader(userIndex) {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  var imgURL = usercollection[userIndex].userProfilePic;
  if(!imgURL) imgURL = "/images/no_user.jpg";
  $("#header").append("<div id='userImage'><img src='"+imgURL+"'>");
  setUpHeaderImage();
  $("#userInfo").append("<div id='userName'>"+usercollection[userIndex].userName);
  $("#userInfo").append("<div id='userDescription'>"+usercollection[userIndex].userDescription);
  getUSerStatus(userIndex);
  getUserAvailableStatus(userIndex);
}

function setUpHeaderImage() {
  $("#userImage img").removeAttr("style");
  if($("#userImage img").width() > $("#userImage img").height()) {
    $("<div id='verticalAlignDiv'>").insertBefore("#userImage img");
    $("#userImage img").css("width","100%");
    $("#verticalAlignDiv").css("height",($("#userImage").height()-$("#userImage img").height())/2);
  }
  else {
    $("#userImage img").css("height","100%");
  }
}

function showUserContent(userIndex) {
  project.clear();
  view.update();
  console.log(usercollection[userIndex].userID);
  $.ajax({
    url: "/functions/getUserContent",
    type: "GET",
    data: {"userID":usercollection[userIndex].userID},
    success:function(response) {
      oldContent[userIndex] = response.content;
      project.clear();
      project.importJSON(response.content);
      view.update();
      showTwitter(userIndex);
    },
    error:function(error) {
      console.log("couldn't get user content");
      showFloaty("no connection");
      if(oldContent[userIndex]) {
        project.clear();
        project.importJSON(oldContent[userIndex]);
        view.update();
        showTwitter(userIndex);
      }
    },
    timeout: ajaxTimeout
  });
}

function showUserBackground(userIndex) {
  $.ajax({
    url:"/functions/getBackground",
    type: "GET",
    data: {"userID":usercollection[userIndex].userID},
    success: function(res) {
      showBackground(res.bg_url);
    },
    error: function(err) {
      console.log("couldn't get user background");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function getUSerStatus(userIndex) {
  $.ajax({
    url:"/functions/getUserStatus",
    type:"GET",
    data:{"userID":usercollection[userIndex].userID},
    success:function(res) {
      if(res) {
        oldStatus[userIndex] = res;
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
      showFloaty("no connection");
      if(oldStatus[userIndex]) {
        var untilDate = moment(oldStatus[userIndex].until);
        var now = moment();
        //var untilDate = new Date(oldStatus.until);
        if(untilDate > now) {
          $("#userInfo").append("<hr>");
          $("#userInfo").append("<div id='userStatus'>"+oldStatus[userIndex].text);
          var time = untilDate.format("HH:mm");
          var date = moment(untilDate).format("DD.MM.YYYY");
          //untilString = moment(untilDate).format("HH:mm DD.MM.YYYY");
          $("#userStatus").append("<br><div>until "+time+"<br>"+date);
        }
      }
    },
    timeout: ajaxTimeout
  });
}

function getUserAvailableStatus(userIndex) {
  $("#userImage img").removeAttr("style");
  setUpHeaderImage();
  $.ajax({
    url:"/functions/getUserAvailableStatus",
    type:"GET",
    data:{"userID":usercollection[userIndex].userID,"roomID":roomID},
    success:function(res) {
      oldAvailableStatus[userIndex] = res;
      //TODO: grey out the not available users
      if(res.available == 0) {
        //if user is not available
        console.log("user is not available");
        $("#userImage img").css({
          "background-color":"#fff",
          "opacity":"0.35",
          "filter":"alpha(opacity=35)"
        });
        $("#userImage").append("<div style='position:absolute; margin:5px; right:0;'>not available");
      }
      else {
        console.log("user is available");
      }
    },
    error:function(err) {
      console.log("couldn't get user available status");
      showFloaty("no connection");
      if(oldAvailableStatus[userIndex]) {
        if(oldAvailableStatus[userIndex].available == 0) {
          //if user is not available
          console.log("user is not available");
          $("#userImage img").css({
            "background-color":"#fff",
            "opacity":"0.35",
            "filter":"alpha(opacity=35)"
          });
          $("#userImage").append("<div style='position:absolute; margin:5px; right:0;'>not available");
        }
        else {
          console.log("user is available");
        }
      }
    },
    timeout: ajaxTimeout
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function selectBoard() {
  var selected = $("#boardOptions select").val();
  window.location.href = "/?BID="+selected;
}

function showTwitter(userIndex) {
  if(twitterAjax) twitterAjax.abort();
  if(twitterEmbedAjax) twitterEmbedAjax.abort();
  $("#twitterDiv").remove();
  twitterAjax = $.ajax({
    url:"/functions/getUserTwitter",
    type:"GET",
    data:{"userID":usercollection[userIndex].userID},
    success:function(res) {
      if(res && res.twitterName && res.tweetID) {
        getTwitterEmbed(res.twitterName,res.tweetID);
        
        //console.log(res);
      }
    },
    error:function(err) {
      console.log("couldn't get twitter content");
      //showFloaty("no connection");
    },
    timeout: 3000
  });
}

function getTwitterEmbed(twitterName,tweetID) {
  var url = "https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/"+twitterName+"/status/"+tweetID;
  twitterEmbedAjax = $.ajax({
    url: url,
    dataType: "jsonp",
    success:function(res) {
      var onlyBlockquote = (res.html).split("<script")[0];
      $("body").append("<div id='twitterDiv'>");
      $("#twitterDiv").append(onlyBlockquote);
      $(".Tweet-card").remove();
      $(".Tweet-actions").remove();
      $(".tweet-brand").remove();
      resize();
    },
    error:function(err) {
      console.log(err);
      //showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function showBackground(background) {
  $("#background").remove();
  var url = background;
  if(!url) return;
  try {
    $("body").append("<iframe id='background' scrolling='no' src='"+url+"'>");
    $("#background").css({
      "width":$("#EditorCanvas").width(),
      "height":$("#EditorCanvas").height()
    });
  }
  catch(err) {
    console.log("couldn't get background " + err);
    $("background").remove();
  }
}