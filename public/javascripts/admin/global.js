var logedIn = false;
var floatyTimer = null;
var floatyTime = 5000;
var popupVisible = false;
var ajaxTimeout = 5000;
$("#login").on("click",login);
$(document).ready(function() {
  paper.setup('EditorCanvas');
  $("#typearea").submit(function(event) {
    event.preventDefault();
  });
  checkSessionLogin();
});

$(window).on("resize",function() {
  if(popupVisible) {
    $("#popup").css({
      left:$(window).width()/2-$("#popup").width()/2
    });
  }
});

function login(event) {
  var mail = $("#mailaddress").val();
  var password = $("#password").val();
  var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  //console.log(hash)
  $.ajax({
    url: '/functions/loginAdmin',
    type: 'POST',
    data: {'mail':mail,'pw':hash},
    success:function(res) {
      if(res == "success") {
        logedIn = true;
        showSettings();
      }
      else {
        $("#password").val("");
        showFloaty("Wrong mail address and/or password!",2000);
      }
    },
    error:function(err) {
      console.log("Error, couldn't login");
      $("#password").val("");
      window.location.replace("/admin");
    },
    timeout: ajaxTimeout
  });
}

function showSettings() {
  var content = $('#content').empty();
  content.append("<div title='Board Settings' onclick='checkSession(loadBoardSettings)' id='boardSettings' class='containerTile'><span class='glyphicon glyphicon-phone'>");
  content.append("<div title='Room Settings' onclick='checkSession(loadRoomSettings)' id='roomSettings' class='containerTile'><span class='glyphicon glyphicon-picture'>");
  content.append("<div title='User Settings' onclick='checkSession(loadUserSettings)' id='userSettings' class='containerTile'><span class='glyphicon glyphicon-user'>");
  content.append("<div title='Logs' id='logs' onclick='checkSession(loadLogging)' class='containerTile'><span class='glyphicon glyphicon-book'>");
  $("#logout").remove();
  $("body").append("<div title='Logout' id='logout' class='containerTile containerTileAbs'><span class='glyphicon glyphicon-log-out'>");
  $("#logout").on("click",logout);
  $("#EditorCanvas").css("visibility","hidden");
}

function logout() {
  $("#EditorCanvas").css("visibility","hidden");
  $("#background").remove();
  removeAllGifs();
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
    },
    timeout: ajaxTimeout
  });
}

function checkSession(callback) {
  $.ajax({
    url: '/functions/checkAdminSession',
    type: 'GET',
    success:function(res) {
      if(res) {
        logedIn = true;
        callback();
      }
      else {
        if(logedIn) {
          logedIn = false;
          window.location.replace("/admin");
        }
      }
    },
    error:function(err) {
      console.log(err);
    },
    timeout: ajaxTimeout
  });
}
function checkSessionIntermediate() {
  $.ajax({
    url: '/functions/checkAdminSession',
    type: 'GET',
    success:function(res) {
      if(res) {
        logedIn = true;
      }
      else {
        logedIn = false;
        window.location.replace("/admin");
      }
    },
    error:function(err) {
      console.log(err);
    },
    timeout: ajaxTimeout
  });
}
function checkSessionLogin() {
  $.ajax({
    url: '/functions/checkAdminSession',
    type: 'GET',
    success:function(res) {
      if(res) {
        logedIn = true;
        showSettings();
      }
      else {
        logedIn = false;
      }
    },
    error:function(err) {
      console.log(err);
    },
    timeout: ajaxTimeout
  });
}

function showPopup() {
  popupVisible = true;
  $("body").append("<div id='popupBackground1' class='popupBackground'>");
  $("body").append("<div id='popup'>");
  $("#popupBackground1").on("click",removePopup);
  $("#popup").css({
    "left": $(window).width()/2 - $("#popup").width()/2 + "px"
  });
}

function removePopup() {
  popupVisible = false;
  $("#popupBackground1").remove();
  $("#popup").remove();
}

function showFloaty(text,time) {
  clearTimeout(floatyTimer);
  $("#floaty").css("left", $(window).width()/2-$("#floaty").width()/2 + "px");
  $("#floaty").empty();
  $("#floaty").append("<h3>"+text);
  $("#floaty").animate({top: '50px'},"slow");
  if(!time) {
    floatyTimer = setTimeout(removeFloaty, floatyTime);
  }
  else {
    floatyTimer = setTimeout(removeFloaty, time);
  }
}

function removeFloaty() {
  $("#floaty").animate({top: '-350px'},"slow");
}

function goToBoard(boardID) {
  window.location.href = "/?BID="+boardID;
}

function popupBackgroundSecond(roomID) {
  $("#popupBackground2").remove();
  removePopup();
  setRoomUsersPopup(roomID);
}