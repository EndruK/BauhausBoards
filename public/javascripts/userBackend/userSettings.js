var loggedInPassword;
function loadUserSettingsPopup(event) {
  if(loggedInPassword) {
    checkSession(showUserSettings);
    return;
  }
  var userIndex;
  for(var i=0; i<usercollection.length; i++) {
    if(usercollection[i].userID == authenticatedUser) {
      userIndex = i;
      break;
    }
  }
  var profilePicURL = usercollection[userIndex].userProfilePic;
  if(!profilePicURL || profilePicURL == null) {
    profilePicURL = "images/default-user.png";
  }
  showPopup();
  startLoginPopupTimer();
  $("#popup").append("<h2>Login");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Login with your password");
  $("#popup").append("<hr>");
  $("#popup").append("<form>");
  $("#popup form").append("<input type='password' id='userPassword'>");
  $("#popup form").submit(function(event) {
    event.preventDefault();
    loginUserPassword();
  });
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='loginUserPassword()'>Login");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function loginUserPassword() {
  if(!$("#userPassword").val()) return;
  var hash = CryptoJS.SHA256($("#userPassword").val()).toString(CryptoJS.enc.Hex);
  $.ajax({
    url:"/functions/loginUserPassword",
    type:"POST",
    data:{"userPassword":hash},
    success:function(res) {
      if(res == "success") {
        loggedInPassword = true;
        stopLoginPopupTimer();
        checkSessionPW(showUserSettings);
      }
      else {
        $("#userPassword").css("border","solid red 2px");
        $("#userPassword").val("");
      }
    },
    error:function(err) {
      console.log("couldn't check user password");
    }
  });
}

function showUserSettings() {
  var userIndex;
  for(var i=0; i<usercollection.length; i++) {
    if(usercollection[i].userID == authenticatedUser) {
      userIndex = i;
      break;
    }
  }
  removePopup();
  $("#sidebarUserSettings .sidebarUpper").empty();
  showSidebar('sidebarUserSettings');
  $('#users').css('visibility','visible');
  $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPopup("+userIndex+")'>Change User");
  $("#sidebarUserSettings .sidebarUpper").append("<br>");
  $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserMailPopup("+userIndex+")'>Change Mail");
  $("#sidebarUserSettings .sidebarUpper").append("<br>");
  $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPWPopup("+userIndex+")'>Change PW");
  $("#sidebarUserSettings .sidebarUpper").append("<br>");
  $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPinPopup("+userIndex+")'>Change Pin");
  if(usercollection[userIndex].adminFlag == 1) {
    $("#sidebarUserSettings .sidebarUpper").append("<br>");
    $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeBoardResolutionPopup("+userIndex+")'>Change Resolution");
  }
}

function changeUserPopup() {

}

function changeUserMailPopup(userIndex) {
  showPopup();
  startLoginPopupTimer();
  $("#popup").append("<h2>Email");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your mail address");
  $("#popup").append("<hr>");
  $("#popup").append("<form>");
  $("#popup form").append("<input type='text' id='userMailInput' value='"+usercollection[userIndex].userMail+"'>");
  $("#popup form").submit(function(event) {
    event.preventDefault();
    changeUserMail();
  });
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserMail("+userIndex+")'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserMail(userIndex) {
  $("#userMailInput").removeAttr("style");
  var mail = $("#userMailInput").val();
  if(mail == usercollection[userIndex].userMail) {
    removePopup();
    stopLoginPopupTimer();
    return;
  }
  if(!validateEmail(mail)) {
    $("#userMailInput").css("border","2px solid red");
    return;
  }
  checkMail(mail,function() {
    $.ajax({
      url:"/functions/changeUserMail",
      type:"POST",
      data:{"userMail":mail},
      success:function(res) {
        usercollection[userIndex].userMail = mail;
        removePopup();
        stopLoginPopupTimer();
        showFloaty("Mail successfully changed");
      },
      error:function(err) {
        console.log(err);
      }
    });
  });
}

function changeUserPWPopup(userIndex) {
  showPopup();
  startLoginPopupTimer();
  $("#popup").append("<h2>Password");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your password");
  $("#popup").append("<hr>");
  $("#popup").append("<div id='changeUserPWDiv' class='changeUserForm'>");
  $("#changeUserPWDiv").append("<form>");
  $("#changeUserPWDiv form").append("<label>old PW");
  $("#changeUserPWDiv form").append("<input type='password' id='oldPasswordInput'>");
  $("#changeUserPWDiv form").append("<br><br>");
  $("#changeUserPWDiv form").append("<label>new PW");
  $("#changeUserPWDiv form").append("<input type='password' id='newPassword'>");
  $("#changeUserPWDiv form").append("<br><br>");
  $("#changeUserPWDiv form").append("<label>check PW");
  $("#changeUserPWDiv form").append("<input type='password' id='newPasswordCheck'>");
  $("#changeUserPWDiv form").submit(function(event) {
    event.preventDefault();
    changeUserPW(userIndex);
  });
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserPW("+userIndex+")'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserPW(userIndex) {
  $("#oldPasswordInput").removeAttr("style");
  $("#newPassword").removeAttr("style");
  $("#newPasswordCheck").removeAttr("style");
  var oldPW = CryptoJS.SHA256($("#oldPasswordInput").val()).toString(CryptoJS.enc.Hex);
  if(!$("#oldPasswordInput").val()) {
    markPWRed()
    return;
  }
  $.ajax({
    url:"/functions/checkUserPW",
    type:"GET",
    data:{"userPassword":oldPW},
    success:function(res) {
      if(res == true) {
        if($("#newPassword").val() && $("#newPassword").val() == $("#newPasswordCheck").val()) {
          var newPassword = CryptoJS.SHA256($("#newPassword").val()).toString(CryptoJS.enc.Hex);
          $.ajax({
            url:"/functions/setNewUserPW",
            type:"POST",
            data:{"userPassword":newPassword},
            success:function(res) {
              showFloaty("Password successfully updated");
              removePopup();
              stopLoginPopupTimer();
            },
            error:function(err) {
              console.log("couldn't update new password");
            }
          });
        }
        else {
          markPWRed();
        }
      }
      else {
        markPWRed();
      }
    },
    error:function(err) {
      console.log("couldn't check pw");
    }
  });
  var newPW = "";
  var newPWCheck = "";
}

function markPWRed() {
  $("#oldPasswordInput").css("border","solid 2px red");
  $("#newPassword").css("border","solid 2px red");
  $("#newPasswordCheck").css("border","solid 2px red");
  $("#oldPasswordInput").val("");
  $("#newPassword").val("");
  $("#newPasswordCheck").val("");
}

function changeUserPinPopup(userIndex) {
  showPopup();
  startLoginPopupTimer();
  $("#popup").append("<h2>Pin");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your pin");
  $("#popup").append("<hr>");
  $("#popup").append("<div id='changeUserPinDiv' class='changeUserForm'>");
  $("#changeUserPinDiv").append("<form>");
  $("#changeUserPinDiv form").append("<label>new Pin");
  $("#changeUserPinDiv form").append("<input type='password' id='newPinInput'>");
  $("#changeUserPinDiv form").submit(function(event) {
    event.preventDefault();
    changeUserPW(userIndex);
  });
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserPin("+userIndex+")'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserPin(userIndex) {
  $.ajax({
    url:"functions/changeUserPin",
    type:"POST",
    data:{"userPin":CryptoJS.SHA256($("#newPinInput").val()).toString(CryptoJS.enc.Hex)},
    success:function(res) {
      showFloaty("Pin successfully updated");
      removePopup();
      stopLoginPopupTimer();
    },
    error:function(err) {
      console.log("couldn't update pin");
    }
  });
}

function changeBoardResolutionPopup() {

}

function checkSessionPW(callback) {
  startAutoLogoutTimer();
  $.ajax({
    url:"/functions/checkUserSessionPW",
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
    }
  });
}

function validateEmail(mail) {
  if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function checkMail(mail,callback) {
  $.ajax({
    url:"/functions/checkMailExists",
    type:"GET",
    data:{"mail":mail},
    success:function(res) {
      if(!res) {
        callback();
        //changeUserAjax(userID,name,password,mail,url,description,twitter,adminFlag,pin);
      }
      else {
        $("#userMailInput").css("border","2px solid red");
        showFloaty("Mail address already exists!");
      }
    },
    error:function(err) {
      console.log("couldn't check mail address");
    }
  });
}