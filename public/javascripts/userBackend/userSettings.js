var loggedInPassword;
var userData;
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
      showFloaty("no connection");
    }
  });
}

function showUserSettings() {
  userData = new Array();
  $.ajax({
    url:"/functions/getUser",
    type:"GET",
    data:{"userID":authenticatedUser},
    success:function(res) {
      userData = res;
      removePopup();
      $("#sidebarUserSettings .sidebarUpper").empty();
      showSidebar('sidebarUserSettings');
      $('#users').css('visibility','visible');
      $("#sidebarUserSettings .sidebarUpper").append("<br>");
      $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPopup()'>Change User");
      $("#sidebarUserSettings .sidebarUpper").append("<br>");
      $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserMailPopup()'>Change Mail");
      $("#sidebarUserSettings .sidebarUpper").append("<br>");
      $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPWPopup()'>Change PW");
      $("#sidebarUserSettings .sidebarUpper").append("<br>");
      $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeUserPinPopup()'>Change Pin");
      if(userData.userAdminFlag == 1) {
        $("#sidebarUserSettings .sidebarUpper").append("<br>");
        $("#sidebarUserSettings .sidebarUpper").append("<button onclick='changeBoardResolutionPopup()'>Change Resolution");
      }
    },
    error:function(err) {
      console.log("couldn't get user data");
      showFloaty("no connection");
    }
  });
}

function changeUserPopup() {
  showPopup();
  stopLoginPopupTimer();
  $("#popup").append("<h2>User");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your informations");
  $("#popup").append("<hr>");
  $("#popup").append("<div id='changeUserInfoDiv' class='changeUserForm'>");
  $("#changeUserInfoDiv").append("<form>");
  $("#changeUserInfoDiv form").append("<label>Name");
  $("#changeUserInfoDiv form").append("<input maxlength='30' type='text' id='nameInput' value='"+userData.userName+"'>");
  $("#changeUserInfoDiv form").append("<br><br>");
  $("#changeUserInfoDiv form").append("<label>Description");
  $("#changeUserInfoDiv form").append("<input maxlength='30' type='text' id='descriptionInput' value='"+userData.userDescription+"'>");
  $("#changeUserInfoDiv form").append("<br><br>");
  $("#changeUserInfoDiv form").append("<label>Twitter");
  $("#changeUserInfoDiv form").append("<input type='text' id='twitterInput' value='"+userData.userTwitter+"'>");
  $("#changeUserInfoDiv form").append("<br><br>");
  $("#changeUserInfoDiv form").append("<label>Profile Pic");
  $("#changeUserInfoDiv form").append("<input type='text' id='picURLInput' value='"+userData.userProfilePic+"'>");
  $("#changeUserInfoDiv form").append("<br class='clear'>");
  $("#changeUserInfoDiv form").append("<button onclick='uploadImage()'>Upload Image");
  $("#changeUserInfoDiv form").append("<input id='picUploadInput' accept='image/*' name='file' type='file' style='display:none'>");
  $("#changeUserInfoDiv form").submit(function(event) {
    event.preventDefault();
    changeUserInfo(userIndex);
  });
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserInfo()'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserInfo() {
  $("#nameInput").removeAttr("style");
  var userName = $("#nameInput").val();
  var userDescription = $("#descriptionInput").val();
  var userTwitter = $("#twitterInput").val();
  var userProfilePic = $("#picURLInput").val();

  if(!userName) {
    $("#nameInput").css("border","solid 2px red");
    return;
  }
  $.ajax({
    url:"/functions/changeUserInfo",
    type:"POST",
    data:{"userName":userName,"userDescription":userDescription,"userTwitter":userTwitter,"userProfilePic":userProfilePic},
    success:function(res) {
      //usercollection[userIndex].userName = userName;
      //usercollection[userIndex].userDescription = userDescription;
      //usercollection[userIndex].userTwitter = userTwitter;
      //usercollection[userIndex].userProfilePic = userProfilePic;
      removePopup();
      stopLoginPopupTimer();
      //showUserHeader(userIndex);
      showFloaty("User info successfully changed");
    },
    error:function(err) {
      console.log("couldn't update user info");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function changeUserMailPopup() {
  showPopup();
  stopLoginPopupTimer();
  $("#popup").append("<h2>Email");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your mail address");
  $("#popup").append("<hr>");
  $("#popup").append("<form>");
  $("#popup form").append("<input maxlength='60' type='text' id='userMailInput' value='"+userData.userMail+"'>");
  $("#popup form").submit(function(event) {
    event.preventDefault();
    changeUserMail();
  });
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserMail()'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserMail() {
  $("#userMailInput").removeAttr("style");
  var mail = $("#userMailInput").val();
  if(mail == userData.userMail) {
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
        //usercollection[userIndex].userMail = mail;
        removePopup();
        stopLoginPopupTimer();
        showFloaty("Mail successfully changed");
      },
      error:function(err) {
        console.log(err);
        showFloaty("no connection");
      },
      timeout: ajaxTimeout
    });
  });
}

function changeUserPWPopup() {
  showPopup();
  stopLoginPopupTimer();
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
    changeUserPW();
  });
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserPW()'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserPW() {
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function markPWRed() {
  $("#oldPasswordInput").css("border","solid 2px red");
  $("#newPassword").css("border","solid 2px red");
  $("#newPasswordCheck").css("border","solid 2px red");
  $("#oldPasswordInput").val("");
  $("#newPassword").val("");
  $("#newPasswordCheck").val("");
}

function changeUserPinPopup() {
  showPopup();
  stopLoginPopupTimer();
  $("#popup").append("<h2>Pin");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change your pin");
  $("#popup").append("<hr>");
  $("#popup").append("<div id='changeUserPinDiv' class='changeUserForm'>");
  $("#changeUserPinDiv").append("<form>");
  $("#changeUserPinDiv form").append("<label>new Pin");
  $("#changeUserPinDiv form").append("<input maxlength='4' type='password' id='newPinInput'>");
  $("#changeUserPinDiv form").submit(function(event) {
    event.preventDefault();
    changeUserPin();
  });
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUserPin()'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $(".popupConfirm button").focus();
}

function changeUserPin() {
  $("#newPinInput").removeAttr("style");
  if(!validatePin($("#newPinInput").val())) {
    $("#newPinInput").css("border","solid 2px red");
    return;
  }
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function changeBoardResolutionPopup() {
  showPopup();
  stopLoginPopupTimer();
  $("#popup").append("<h2>Board Resolution");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change the Resolution");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Set Automatically");
  $("#popup").append("<button title='set to current window size' onclick='setBoardResolution("+boardID+",\"aut\")'>Set");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Set Manually");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Width:");
  $(".popupConfirm").append("<input type='text' id='resX'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<label>Height:");
  $(".popupConfirm").append("<input type='text' id='resY'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<button onclick='setBoardResolution("+boardID+",\"man\")'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  getBoardResolution(boardID);
  $(".popupConfirm button:last").focus();
}

function setBoardResolution(boardID,type) {
  var resX;
  var resY;
  if(type == 'man') {
    resX = $("#resX").val();
    resY = $("#resY").val();
  }
  else if(type == 'aut') {
    resX = $(window).width();
    resY = $(window).height();
  }
  $.ajax({
    url:"/functions/setBoardDimUserBackend",
    type:"POST",
    data:{"boardID":boardID,"resX":resX,"resY":resY},
    success:function(res) {
      removePopup();
      showFloaty("Resolution for Board " + boardID + " successfully updated.");
      stopLoginPopupTimer();
    },
    error:function(err) {
      console.log("couldn't set board resolution");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
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
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
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
      }
      else {
        $("#userMailInput").css("border","2px solid red");
        showFloaty("Mail address already exists!");
      }
    },
    error:function(err) {
      console.log("couldn't check mail address");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}

function uploadImage() {
  //$("#picURL").trigger("click");
  $("#picUploadInput").trigger("click");
  $("#picUploadInput").change(function(event) {
    var file = event.target.files[0];
    if(!file || !file.type.match(/image.*/)) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
      var result = event.target.result;
      var image  = result.substr(result.indexOf(",") + 1);
      showFloaty("Uploading Image...",1000*60);
      $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        headers: {
          Authorization: "Client-ID 395d5a7dec70b4a"
        },
        data: {
          image: image
        },
        dataType: "json",
        success: function(res){
          url = res.data.link;
          $("#picURLInput").val(url);
          showFloaty("Image successfully uploaded!");
        },
        error: function(err) {
          console.log(err);
          showFloaty("Error while uploading image!");
        },
        complete: function() {
          //TODO remove uploading indicator
        },
        timeout: ajaxTimeout
      });
    };
    reader.readAsDataURL(file);
  });
}

function validatePin(pin) {
  if(/^\d\d\d\d$/.test(pin)) {
    return true;
  }
  return false;
}

function getBoardResolution(boardID) {
  $.ajax({
    url:"/functions/getBoard",
    type:"GET",
    data:{"boardID":boardID},
    success:function(res) {
      $("#resX").val(res.boardResX);
      $("#resY").val(res.boardResY);
    },
    error:function(err) {
      console.log("couldn't get board resolution");
      showFloaty("no connection");
    },
    timeout: ajaxTimeout
  });
}