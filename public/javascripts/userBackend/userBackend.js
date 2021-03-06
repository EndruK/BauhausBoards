var loginPopupTimer = null;
var loginPopupTime = 1000*20; //20sec
var autoLogoutTimer = null;
var autoLogoutTime = 1000*60*5 //5min
var loggedIn = false;
var authenticatedUser = null;

$('.sidebar').on('click', '.btnSetStatus', function(){checkSession(loadChangeStatus)});
$('.sidebar').on('click', '.btnChangeContent', function(){checkSession(loadChangeContent)});
$('.sidebar').on('click', '.btnViewMessages', function(){checkSession(loadViewMessages)});
$('.sidebar').on('click', '.btnUserSettings', function(){checkSession(loadUserSettingsPopup)});
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
        res.forEach(function(key) {
          var profilePicURL = key.userProfilePic;
          if(!profilePicURL || profilePicURL == null) {
            profilePicURL = "images/no_user.jpg";
          }
          $("#usersInRoom").append("<div class='userTile'><div>"+
            "<img title='Login as "+key.userName+"' src='"+profilePicURL+"' onclick='loginPopup("+key.userID+",\""+key.userName+"\",\""+profilePicURL+"\")'>");
          $("#usersInRoom").children().last().append("<br>"+key.userName);
        });
        $("<br><br>").insertAfter("#usersInRoom");
      }
    },
    error:function(err) {
      console.log("couldn't get users for room");
      showFloaty("no connection");
    },
    complete:function() {
      $("#popup").append("<div class='popupConfirm'>");
      $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
      $(".popupConfirm button").focus();
      // just a small hack to display the scrollbar on the tablet
      showUser(selectedUser);
    },
    timeout: ajaxTimeout
  });
}

function loginPopup(userID,userName,userProfilePic) {
  startLoginPopupTimer();
  $("#popup").empty();
  $("#popup").append("<h2>Login");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert Pin for "+userName);
  $("#popup").append("<hr>");
  $("#popup").append("<div id='usersInRoom' class='roomUsers'><form>");
  $("#usersInRoom").css("overflow","hidden");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='login("+userID+")'>Login");
  $(".popupConfirm").append("<button onclick='{removePopup(); userLoginPopup();}'>Cancel");
  $("#usersInRoom form").append("<input type='password' id='userPin' maxlength='4' size='2'><br>");
  $("#usersInRoom form").submit(function(event) {
    event.preventDefault();
    login(userID);
  });
  $("#usersInRoom").append("<div class='userTile'><div><img id='loginProfilePic' title='"+userName+"' src='"+userProfilePic+"'>");
  $("#loginProfilePic").css("cursor","default");
  $("#usersInRoom form").children().last().append("<br>"+userName+"<hr>");
  $("#userPin").focus();
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
        stopLoginPopupTimer();
        checkSession(showUserBackend);
      }
      else {
        $("#userPin").css("border","solid red 2px");
        $("#userPin").val("");
      }
    },
    error:function(err) {
      console.log("couldn't login user with pin");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function startLoginPopupTimer() {
  clearTimeout(loginPopupTimer);
  loginPopupTimer = setTimeout(removePopup,loginPopupTime);
}

function stopLoginPopupTimer() {
  clearTimeout(loginPopupTimer);
}

function startAutoLogoutTimer() {
  clearTimeout(autoLogoutTimer);
  autoLogoutTimer = setTimeout(logoutUser,autoLogoutTime);
}
function stopAutoLogoutTimer() {
  clearTimeout(autoLogoutTimer);
}

function showUserBackend() {
  removePopup();
  showSidebar('sidebarUserBackend');
  for(var i=0; i<usercollection.length; i++) {
    if(usercollection[i].userID == authenticatedUser) showUserHeader(i);
  }
}

function checkSession(callback) {
  startAutoLogoutTimer();
  $.ajax({
    url:"/functions/checkUserSession",
    type:'GET',
    success:function(res) {
      if(res != "session valid") {
        stopAutoLogoutTimer();
        loggedIn = false;
        loggedInPassword = false;
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function logoutUser() {
  stopAutoLogoutTimer();
  removePopup();
  loggedIn = false;
  loggedInPassword = false;
  $.ajax({
    url:'/functions/logoutUser',
    type:'GET',
    success:function(res) {
      //showFloaty("Successfully logged out.");
      //loadMain();
      window.location.reload(true);
    },
    error:function(err) {
      console.log("couldn't logout user");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}