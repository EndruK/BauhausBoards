var loginPopupTimer = null;
var loginPopupTime = 1000*15; //15sec
var loggedIn = false;
var authenticatedUser = null;

$('.sidebar').on('click', '.btnChangeContent', loadChangeContent);
$('.sidebar').on('click', '.btnViewMessages', loadViewMessages);
$('.sidebar').on('click', '.btnUserSettings', loadUserSettings);
$('.sidebar').on('click', '.btnLogout', logoutUser);

function userLoginPopup() {
  if(loggedIn) {
    checkSession(showUserBackend);
    return;
  } 
  showPopup();
  startLoginPopupTimer();
  $("#popup").append("<h2>Login");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Select a User to Login");
  $("#popup").append("<hr>");
  $.ajax({
    url:"/functions/getUsersForRoom",
    type:"GET",
    data:{"roomID":roomID},
    success:function(res) {
      $("#popup").append("<div id='usersInRoom' class='roomUsers'>");
      if(res.length == 0) {
        $("#usersInRoom").append("There are currently no users in this room.");
      }
      else {
        var counter = 0;
        res.forEach(function(key) {
          if(counter > 3) {
            $("#usersInRoom").append("<br>");
            counter = 0;
          }
          var profilePicURL = key.userProfilePic;
          if(!profilePicURL || profilePicURL == null) {
            profilePicURL = "images/default-user.png";
          }
          $("#usersInRoom").append("<div class='userTile'><div>"+
            "<img title='Login as "+key.userName+"' src='"+profilePicURL+"' onclick='loginPopup("+key.userID+",\""+key.userName+"\",\""+profilePicURL+"\")'>");
          $("#usersInRoom").children().last().append("<br>"+key.userName);
          counter += 1;
        });
        $("<br><br>").insertAfter("#usersInRoom");
      }
    },
    error:function(err) {
      console.log("couldn't get users for room");
    },
    complete:function() {
      $("#popup").append("<div class='popupConfirm'>");
      $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
      showUser(selectedUser);
    }
  });
}

function loginPopup(userID,userName,userProfilePic) {
  startLoginPopupTimer();
  $("#popup").empty();
  $("#popup").append("<h2>Login");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert Pin for "+userName);
  $("#popup").append("<hr>");
  $("#popup").append("<div id='usersInRoom' class='roomUsers'>");
  $("#popup").append("<div class='popupConfirm'>");
  $("<br>").insertAfter("#usersInRoom");
  $(".popupConfirm").append("<button onclick='login("+userID+")'>Login");
  $(".popupConfirm").append("<button onclick='{removePopup(); userLoginPopup();}'>Cancel");
  $("#usersInRoom").append("<div class='userTile'><div><img id='loginProfilePic' title='"+userName+"' src='"+userProfilePic+"'>");
  $("#loginProfilePic").css("cursor","default");
  $("#usersInRoom").children().last().append("<br>"+userName);
  $("#usersInRoom").append("<br><input type='password' id='userPin' maxlength='4' size='2'><hr>");
}

function login(userID) {
  var pin = $("#userPin").val();
  var hash = CryptoJS.SHA256(pin).toString(CryptoJS.enc.Hex);
  $.ajax({
    url:"/functions/loginUserPin",
    type:"POST",
    data:{"userID":userID,"userPin":hash},
    success:function(res) {
      if(res == "success") {
        loggedIn = true;
        authenticatedUser = userID;
        showUserBackend();
      }
    },
    error:function(err) {
      console.log("couldn't login user with pin");
    }
  });
}

function loadChangeContent(event) {
  $('#header').text('change Content');
  showSidebar('sidebarChangeContent');
  updateTimer();
}
function loadViewMessages(event) {
  $('#header').text('View Messages');
  showSidebar('sidebarViewMessages');
  updateTimer();
}
function loadUserSettings(event) {
  $('#header').text('User Settings');
  showSidebar('sidebarUserSettings');
  $('#users').css('visibility','visible');
  loadUser();
  updateTimer();
}

function startLoginPopupTimer() {
  //clearTimeout(loginPopupTimer);
  //loginPopupTimer = setTimeout(removePopup,loginPopupTime);
}

function stopLoginPopupTimer() {
  //clearTimeout(loginPopupTimer);
}

function showUserBackend() {
  removePopup();
  showSidebar('sidebarUserBackend');
  for(var i=0; i<usercollection.length; i++) {
    if(usercollection[i].userID == authenticatedUser) showUserHeader(i);
  }
}

function checkSession(callback) {
  $.ajax({
    url:"/functions/checkUserSession",
    type:'GET',
    success:function(res) {
      if(res != "session valid") {
        loggedIn = false;
        authenticatedUser = null;
        showFloaty("Session expired!");
        loadMain();
      }
      else {
        callback();
      }
    },
    error:function(err) {
      console.log(err);
    }
  });
}

function logoutUser() {
  loggedIn = false;
  $.ajax({
    url:'/functions/logoutUser',
    type:'GET',
    success:function(res) {
      showFloaty("Successfully logged out.");
      loadMain();
    },
    error:function(err) {
      console.log("couldn't logout user");
    }
  });
}