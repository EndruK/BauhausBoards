var usercollection = new Array();
paper.install(window);
var dim = null;
var actualUserIndex = 0;
var switchUserTimerHandler = null;
var switchUserTime = 20000;
//var switchUserTime = 5000;

//initial functions
$( document ).ready(function() {
  boardID = location.search.split("BID=")[1];
  if(!boardID) {
    loadNewBoard();
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
  //reset everything before loading
  
  
  
  
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
        dim = {"resX":$(window).width()-10,"resY":$(window).height()-10};
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
}

function showUser(userID) {
  actualUserIndex = findUID(userID);
  //TODO: mark current selected user
  var header = $("#header");
  header.empty();
  project.clear();
  view.update();
  //append the user Info Area
  header.append("<div class='userInfo'></div>");
  //append the user Image Area
  header.append("<div class='userImage'></div>");
  //get the position of the current user in the usercollection array
  var collectionID = null;
  for(var i = 0; i<usercollection.length; i++) {
    if(usercollection[i].id == userID) {
      collectionID = i;
    }
  }
  var userInfo = $(".userInfo");
  var userImage = $(".userImage");
  //set the name of the user in the Info Area
  userInfo.append("<div class='userName'>" + usercollection[collectionID].name + "</div>");
  userInfo.append("<div class='userDescription'>" + usercollection[collectionID].description + "</div>");
  var imageURL = usercollection[collectionID].profilePic;
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
  $.ajax({
    url: "/functions/getUserContent",
    type: "GET",
    data: {"userID":userID},
    success:function(response) {
      project.clear();
      project.importJSON(response.content);
    },
    error:function(error) {
      console.log("couldn't get user content");
    }
  })
}


//switch between the users
function switchUser() {
  actualUserIndex = actualUserIndex+1;
  if(actualUserIndex > usercollection.length-1) actualUserIndex = 0
  showUser(usercollection[actualUserIndex].id);
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