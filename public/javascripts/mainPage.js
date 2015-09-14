var usercollection = new Array();

//make the initial ajax call
$( document ).ready(function() {

  //TODO: if no cookie --> create new and switch to initial setup

  //TODO: get boardID of cookie
  var boardID = 1;
  $.ajax({
    url: "/functions/loadBoard",
    type: "GET",
    data: {"boardID":boardID},
    success: function(data) {
      console.log(data);
      usercollection = data;
      var buttonContainer = $("#sidebarMain").children(".sidebarUpper");
      usercollection.forEach(function(key) {
        buttonContainer.append("<button class='btnUser' id='user" + key.id + "' onclick='showUser(" + key.id + ")'>" + key.name + "</button><br><br>");
      });
      showUser(usercollection[0].id);
    },
    error: function(data) {
      console.log("Error, couldn't retreive board with ID " + boardID);
    }
  });
});

function showUser(userID) {
  //console.log(usercollection);
  //TODO: change header content
  //TODO: mark current selected user
  //TODO: get current status of current user (too get the freshest version after a switch)
  var header = $("#header");
  header.empty();
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
  if(imageURL != null) {
    userImage.append("<img src=" + imageURL + " style='max-width:100%; max-height:100%;'>");
  }
  else {
    //TODO: anpassen der Image größen!!
    userImage.append("<img src='images/default-user.png' style='height:inherit,width:inherit;'>");
  }
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
        console.log(response);
      }
    },
    error:function(error) {
      console.log("couldn't get user status");
    }
  });
}