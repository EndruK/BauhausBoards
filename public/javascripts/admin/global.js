var logedIn = false;
var floatyTimer = null;
var floatyTime = 5000;
$("#login").on("click",login);
$(document).ready(function() {
  $("#typearea").submit(function(event) {
    event.preventDefault();
  });
  checkSessionLogin();
});

function login(event) {
  var mail = $("#mailaddress").val();
  var password = $("#password").val();
  $.ajax({
    url: '/functions/loginAdmin',
    type: 'POST',
    data: {'mail':mail,'pw':password},
    success:function(res) {
      console.log(res);
      if(res == "success") {
        logedIn = true;
        showSettings();
      }
    },
    error:function(err) {
      console.log("Error, couldn't login");
      window.location.replace("/admin");
    }
  });
}

function showSettings() {
  var content = $('#content').empty();
  content.append("<div id='boardSettings' class='containerTile'>Board");
  content.append("<div id='roomSettings' class='containerTile'>Room");
  content.append("<div id='userSettings' class='containerTile'>User");
  content.append("<div class='clear'>");
  content.append("<div id='logout' class='containerTile containerTileAbs'>Logout");
  $("#boardSettings").on("click",{call:loadBoardSettings},checkSession);
  $("#roomSettings").on("click",{call:loadRoomSettings},checkSession);
  $("#userSettings").on("click",{call:loadUserSettings},checkSession);
  $("#logout").on("click",logout);

}

function logout() {
  $.ajax({
    url:'/functions/logoutAdmin',
    type: 'POST',
    success:function(res) {
      console.log(res);
      logedIn = false;
      window.location.replace("/admin");
    },
    error:function(err) {
      console.log(err);
      window.location.replace("/admin");
    }
  });
}

function loadUserSettings(event) {
  console.log("user");
}

function checkSession(event) {
  $.ajax({
    url: '/functions/checkAdminSession',
    type: 'GET',
    success:function(res) {
      if(res) {
        console.log("user session valid");
        logedIn = true;
        event.data.call();
      }
      else {
        console.log("user session not valid");
        if(logedIn) {
          window.location.replace("/admin");
        }
      }
    },
    error:function(err) {
      console.log(err);
    }
  });
}
function checkSessionLogin() {
  $.ajax({
    url: '/functions/checkAdminSession',
    type: 'GET',
    success:function(res) {
      if(res) {
        console.log("user session valid");
        showSettings();
      }
      else {
        console.log("user session not valid");
      }
    },
    error:function(err) {
      console.log(err);
    }
  });
}

function showPopup() {
  popupVisible = true;
  $("body").append("<div id='popupBackground'>");
  $("body").append("<div id='popup'>");
  $("#popupBackground").on("click",removePopup);
  $("#popup").css({
    "left": $(window).width()/2 - $("#popup").width()/2 + "px"
  });
}

function removePopup() {
  popupVisible = false;
  $("#popupBackground").remove();
  $("#popup").remove();
}

function showFloaty() {
  $("#floaty").css("left", $(window).width()/2-$("#floaty").width()/2 + "px");
  $("#floaty").animate({top: '50px'},"slow");
  floatyTimer = setTimeout(removeFloaty, floatyTime);
}
function removeFloaty() {
  $("#floaty").animate({top: '-350px'},"slow");
}