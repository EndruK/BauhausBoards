var usercollection = new Array();
paper.install(window);
var dim = null;
var selectedUser;
var switchUserTimerHandler = null;
var switchUserTime = 20000;

var roomID;
//var switchUserTime = 5000;

//initial functions
$( document ).ready(function() {
  boardID = location.search.split("BID=")[1];
  if(!boardID) {
    showSelectBoardPopup();
    return;
  }
  loadBoard();
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
}

function loadBoard() {
  getBoard();



  //reset everything before loading
  
  
  
  /*
  $.ajax({
    url: "functions/getBoardDim",
    type: "GET",
    data: {"boardID":boardID},
    success: function(res) {
      console.log(res);
      if(!res){
        loadNewBoard();
        return;
      }
      else if(res.resX == "" || res.resY == "") {
        dim = {"resX":$(window).width()-1,"resY":$(window).height()-1};
        alert("Warning: No resolution for board registered");
      }
      else {
        dim = res;
      }
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
      resize();
      show_gifs();
      addGifTicker();
      //check if the board has a room
      $.ajax({
        url: "/functions/boardHasRoom",
        type: "GET",
        data: {"boardID":boardID},
        success:function(data) {
          console.log(data);
          if(!data) {
            var result = confirm("Board has no room assigned! Switch to board settings?");
            if(result) {
              loadRoomSettings();
            }
          }
          else {
            //finally load the board
            $.ajax({
              url: "/functions/loadBoardUsers",
              type: "GET",
              data: {"boardID":boardID},
              success: function(data) {
                //TODO: check if there are users registered to the board
                usercollection = new Array();
                if(data.length == 0) {
                  return;
                }
                usercollection = data;
                var buttonContainer = $("#sidebarMain").children(".sidebarUpper");
                $("#sidebarMain .sidebarUpper").empty();
                buttonContainer.append("<br>");
                usercollection.forEach(function(key) {
                  buttonContainer.append("<button class='btnUser' value='"+key.id+"'>" + key.name + "</button><br><br>");
                });
                $(".btnUser").on("click",function(event) {
                  var val = $(this).attr("value");
                  if(findUID(val) != actualUserIndex) {
                    startSwitchUserTimer();
                    showUser(val);
                  }
                });
                $("#EditorCanvas").attr("width",dim.resX);
                $("#EditorCanvas").attr("height",dim.resY);
                $("#EditorCanvas").css("width",dim.resX);
                $("#EditorCanvas").css("height",dim.resY);
                showUser(usercollection[0].id);
                if(usercollection.length > 1) {
                  startSwitchUserTimer();
                }
              },
              error: function(data) {
                console.log("Error, couldn't retreive board with ID " + boardID);
              }
            });
          }
        },
        error:function(error) {
          console.log("Error, couldn't get room for board with ID " + boardID);
        }
      });
    },
    error:function(err) {
      console.log(err);
    }
  });
*/
}


function getBoard() {
  console.log("getBoards");
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
  show_gifs();
  addGifTicker();
  selectedUser = 0;
  showUser(selectedUser);
}

function initSidebar() {
  var buttonContainer = $("#sidebarMain").children(".sidebarUpper");
  buttonContainer.empty();
  console.log(usercollection);
  for(var i=0; i<usercollection.length; i++) {
    buttonContainer.append("<button name='"+i+"' onclick='selectUser("+i+")'>"+usercollection[i].userName);
    buttonContainer.append("<br>");
  };
}

function selectUser(userIndex) {
  updateTimer();
  selectedUser = userIndex;
  showUser(userIndex);
}

function initHeader() {
  $("#header").empty();
}


function showUser(userIndex) {
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



  /*
  //append the user Info Area
  $("#header").append("<div class='userInfo'></div>");
  //append the user Image Area
  $("#header").append("<div class='userImage'></div>");

  var userInfo = $(".userInfo");
  var userImage = $(".userImage");

  //set the name of the user in the Info Area
  userInfo.append("<div class='userName'>" + usercollection[userIndex].userName + "</div>");
  userInfo.append("<div class='userDescription'>" + usercollection[userIndex].userDescription + "</div>");
  var imageURL = usercollection[userIndex].userProfilePic;
  //check if there is an url and check if there is an image on the url
  if(imageURL == null) {
    imageURL = "images/default-user.png";
  }
  userImage.append("<img id='uImg' src=" + imageURL + " >");

  userInfo.append("<div class='userStatus'></div>");
  //get the user status
  $.ajax({
    url: "/functions/getUserStatus",
    type: "GET",
    data: {"userID":userID},
    success:function(response) {
      if(response) {
        $(".userStatus").append("<hr>");
        $(".userStatus").append(response.text);
        $(".userStatus").append("<br>");
        $(".userStatus").append(response.since);
        $(".userStatus").append("<br>");
        $(".userStatus").append(response.until);
      }
    },
    error:function(error) {
      console.log("couldn't get user status");
    }
  });
  */
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
    },
    error:function(error) {
      console.log("couldn't get user content");
    }
  })
}

function getUSerStatus(userIndex) {
  $.ajax({
    url:"/functions/getUserStatus",
    type:"GET",
    data:{"userID":usercollection[userIndex].userID},
    success:function(res) {
      if(res) {
        var untilDate = new Date(res.until);
        if(untilDate > new Date()) {
          $("#userInfo").append("<hr>");
          $("#userInfo").append("<div id='userStatus'>"+res.text);
          untilString = moment(untilDate).format("HH:mm DD.MM.YYYY");
          $("#userStatus").append("<br><div>~ "+untilString);
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
  switchUserTimerHandler = setInterval(switchUser,switchUserTime);
}

function stopSwitchUserTimer() {
  clearInterval(switchUserTimerHandler);
}

function findUID(userID) {
  for(var i=0; i<usercollection.length; i++) {
    if(usercollection[i].id == userID) return i;
  }
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