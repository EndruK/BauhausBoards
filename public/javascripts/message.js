var messageSelectedUsers;
var allUsers;

//TODO: create timers to switch back to the main page
var timerPopup;
var timerMessage;

$('.sidebar').on('click', '#askToLeave', askToLeave);
$('.sidebar').on('click', '.btnSubmitMessage', submitMessage);

function loadMessagePopup(event) {
  messageSelectedUsers = new Array();
  allUsers = new Array();
  showPopup()
  $("#popup").append("<h2>Create Message");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Select the users to compose a message for.");
  $("#popup").append("<hr>");

  $.ajax({
    url:"/functions/getUsersForRoom",
    type:"GET",
    data:{"roomID":roomID},
    success:function(res) {
      res.forEach(function(key) {
        allUsers.push(key.userID);
      });
      $("#popup").append("<div id='usersInRoom' class='roomUsers'>");
      if(res.length == 0) {
        $("#usersInRoom").append("There are currently no users in this room.");
      }
      else {
        res.forEach(function(key) {
          var profilePicURL = key.userProfilePic;
          if(!profilePicURL || profilePicURL == null) {
            profilePicURL = "images/default-user.png";
          }
          $("#usersInRoom").append("<div class='userTile'><div>"+
            "<img title='Select "+key.userName+"' src='"+profilePicURL+"' value='"+key.userID+"' onclick='handleSelection("+key.userID+")'>");
          $("#usersInRoom").children().last().append("<br>"+key.userName);
        });
        //$("<br>").insertAfter("#usersInRoom");
      }
    },
    error:function(err) {
      console.log("couldn't get users for room");
    },
    complete:function() {
      $("#popup").append("<div class='popupConfirm'>");
      $(".popupConfirm").append("<button onclick='composeTo(\"selected\")'>Compose");
      $(".popupConfirm").append("<button onclick='composeTo(\"all\")'>Compose to all");
      //$(".popupConfirm").append("<button onclick=''>generate QR code");
      $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
      $(".popupConfirm button").focus();
      // just a small hack to display the scrollbar on the tablet
      showUser(selectedUser);
    }
  });
}

function composeTo(type) {
  removePopup();
  undo_undoStack = FixedQueue(undo_stackLength);
  undo_redoStack = FixedQueue(undo_stackLength);
  paper.setup('EditorCanvas');
  activeColor = colors["black"];
  showSidebar('sidebarCreateMessage');
  openSidebar();
  addImageDropLayer();
  show_gifs();
  removeAllGifs();
  updateTimer();
  activatePenTool();
  $('#tabletSizePreview').css('visibility','visible');
  var messageCollection = new Array();
  if(type == "selected") {
    messageCollection = messageSelectedUsers.slice();
  }
  else {
    messageCollection = allUsers.slice();
  }
  showUsersInHeader(messageCollection);
}

function showUsersInHeader(messageCollection) {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  var count = 0;
  usercollection.forEach(function(key) {
    if($.inArray(key.userID,messageCollection) != -1) {
      if(count == 4) {
        $("#userInfo").append("...");
        return;
      }
      count += 1;
      $("#userInfo").append(key.userName+"<br>");
    }
  });

  //$("#userInfo").append("hans<br>peter<br>erwin<br>...");
  $("#header").append("<div id='userImage'>")
  $("#userImage").append("pic of selected tool");
}

/*function loadCreateMessage(event) {
  var tmp  = $('#header').text('Compose Message\nall selected persons have to be displayed here');
  undo_undoStack = FixedQueue(undo_stackLength);
  undo_redoStack = FixedQueue(undo_stackLength);
  tmp.html(tmp.html().replace(/\n/g,'<br>'));
  paper.setup('EditorCanvas');
  activatePenTool();
  activeColor = colors["black"];
  showSidebar('sidebarCreateMessage');
  clearTimeout(5000);
  updateTimer();
  addImageDropLayer();
  show_gifs();
  removeAllGifs();
  $('#tabletSizePreview').css('visibility','visible');
}*/

function handleSelection(userID) {
  var tiles = $("#usersInRoom .userTile");
  tiles.each(function() {
    var imgInTile = $(this).find("div img");
    if(imgInTile.attr("value") == userID) {
      if($.inArray(userID,messageSelectedUsers) == -1) {
        messageSelectedUsers.push(userID);
        imgInTile.css("border","solid 2px red");
        return;
      }
      else {
        messageSelectedUsers.pop(userID);
        imgInTile.removeAttr("style");
        return;
      }
    }
  });
}

function askToLeave(event) {
  var input = confirm("Do you really want to discard your message?");
  if(input) {
    loadMain();
  }
}

function submitMessage() {
  project.deselectAll();
  removeBoundingBox();
  removeSelectionPopup();
  console.log(project.exportJSON());
}