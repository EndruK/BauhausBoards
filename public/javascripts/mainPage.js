var usercollection = new Array();
paper.install(window);
var dim = null;
//initial functions
$( document ).ready(function() {
  //TODO: if no cookie --> create new and switch to initial setup
  //TODO: get boardID of cookie or url??
  var boardID = 1;
  $.ajax({
    url: "functions/getBoardDim",
    type: "GET",
    data: {"boardID":boardID},
    success: function(res) {
      console.log([res.resX,res.resY]);
      //DOM element get because jquery didn't work
      dim = res;
      var jSizePrevCanv = $("#tabletSizePreview");
      jSizePrevCanv.attr("width",res.resX+1);
      jSizePrevCanv.attr("height",res.resY+1);


      var sizePrevCanvas = document.getElementById("tabletSizePreview");
      var context = sizePrevCanvas.getContext("2d");
      context.beginPath();
      context.moveTo(res.resX+1,0);
      context.lineTo(res.resX+1,res.resY+1);
      context.lineTo(0,res.resY+1);
      context.stroke();
      resize();
    },
    error:function(err) {
      console.log(err);
    }
  });

  show_gifs();
  addGifTicker();
  $.ajax({
    url: "/functions/loadBoard",
    type: "GET",
    data: {"boardID":boardID},
    success: function(data) {
      //console.log(data);
      usercollection = data;
      var buttonContainer = $("#sidebarMain").children(".sidebarUpper");
      usercollection.forEach(function(key) {
        buttonContainer.append("<button class='btnUser' id='user" + key.id + "' onclick='showUser(" + key.id + ")'>" + key.name + "</button><br><br>");
      });
      $("#EditorCanvas").attr("width",dim.resX);
      $("#EditorCanvas").attr("height",dim.resY);
      $("#EditorCanvas").css("width",dim.resX);
      $("#EditorCanvas").css("height",dim.resY);
      showUser(usercollection[0].id);
    },
    error: function(data) {
      console.log("Error, couldn't retreive board with ID " + boardID);
    }
  });
});

$(window).on("resize",resize);

function resize() {
  //set the header position to the dimension sizes
  //if the view is greater
  if(dim && $(window).width() > dim.resX) {
    var diff = $(window).width()-dim.resX;
    $("#header").css("right",$(window).width()-dim.resX);
    $("#content").css("width",$(window).width());
  }
  else {
    var diff = $(window).width()-dim.resX;
    console.log(diff);
    $("#header").css("right",diff);
    $("#content").css("width",dim.resX);
  }
  if(dim && $(window).height() > dim.resY) {
    $("#content").css("height",$(window).height());
  }
  else {
    $("#content").css("height",dim.resY);
  }
}

function showUser(userID) {
  //console.log(usercollection);
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
      project.importJSON(response.content);
    },
    error:function(error) {
      console.log("couldn't get user content");
    }
  })
}

//function 