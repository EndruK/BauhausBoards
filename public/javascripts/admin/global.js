$("#login").on("click",login);
$(document).ready(function() {
  $("#typearea").submit(function(event) {
    event.preventDefault();
  });
  var e = jQuery.Event();
  e.data = {call:showSettings};
  checkSession(e);
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
        event.data.call();
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