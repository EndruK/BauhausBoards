var messageSelectedUsers;
var allUsers;
var messageCollection;

var timerPopup;
var messagePopupTime = 1000*20; //20sec
var timerMessage;
var messageTime = 1000*60*5 //5min

$('.sidebar').on('click', '#askToLeave', askToLeave);
$('.sidebar').on('click', '.btnSubmitMessage', submitMessagePopup);

function loadMessagePopup(event) {
  activeColor = colors["black"];
  switchButtonColor();
  strokeSize = 1;
  setSidebarStrokeButtonClass("minStroke");
  messageSelectedUsers = new Array();
  allUsers = new Array();
  showPopup();
  startMessagePopupTimer();
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
            profilePicURL = "images/no_user.jpg";
          }
          $("#usersInRoom").append("<div class='userTile'><div>"+
            "<img title='Select "+key.userName+"' src='"+profilePicURL+"' value='"+key.userID+"' onclick='handleSelection("+key.userID+")'>");
          $("#usersInRoom").children().last().append("<br>"+key.userName);
        });
      }
    },
    error:function(err) {
      console.log("couldn't get users for room");
      showFloaty("no connection");
    },
    complete:function() {
      $("#popup").append("<div class='popupConfirm'>");
      $(".popupConfirm").append("<button onclick='composeTo(\"selected\")'>Compose");
      $(".popupConfirm").append("<button onclick='composeTo(\"all\")'>Compose to all");
      //$(".popupConfirm").append("<button onclick=''>generate QR code");
      $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
      $(".popupConfirm button:last").focus();
      // just a small hack to display the scrollbar on the tablet
      //showUser(selectedUser);
    },
    timeout: ajaxTimeout
  });
}

function composeTo(type) {
  messageCollection = new Array();
  if(type == "selected") {
    messageCollection = messageSelectedUsers.slice();
  }
  else {
    messageCollection = allUsers.slice();
  }
  if(messageCollection.length > 0) {
    stopSwitchUserTimer();
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
    project.clear();
    view.update();
    startMessageTimer();
    $('#tabletSizePreview').css('visibility','visible');
    showUsersInHeader();
    switchButtonColor();
  }
  else {
    showFloaty("Select a user!");
  }
}

function showUsersInHeader() {
  $("#header").empty();
  $("#header").append("<div id='userInfo'>");
  $("#userInfo").append("<div id='userName'>Compose Message to");
  $("#userInfo").append("<div id='userDescription'>");
  var count = 0;
  if(usercollection.length == messageCollection.length) {
    $("#userDescription").append("All users in room");
  }
  else {
    usercollection.forEach(function(key) {
      if($.inArray(key.userID,messageCollection) != -1) {
        if(count == 4) {
          $("#userDescription").append("... and more");
          return;
        }
        count += 1;
        $("#userDescription").append(key.userName+"<br>");
      }
    });
  }
  $("#header").append("<div id='userImage'>");
  $("#userImage").append("<span class='glyphicon'>");
  showIcon("pen");
}

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
  if(JSON.parse(project.exportJSON()).length > 0) {
    showPopup();
    startMessagePopupTimer();
    $("#popup").append("<h2>Cancel Message");
    $("#popup").append("<hr>");
    $("#popup").append("<h4>Do you want to discard this message?");
    $("#popup").append("<hr>");
    $("#popup").append("<div class='popupConfirm'>");
    $(".popupConfirm").append("<button onclick='{removePopup(); loadMain(); stopMessageTimer(); stopMessagePopupTimer(); closeSidebar();}'>Discard");
    $(".popupConfirm").append("<button onclick='{removePopup(); stopMessagePopupTimer();}'>Cancel");
    $(".popupConfirm button:last").focus();
  }
  else {
    loadMain();
    stopMessageTimer();
    closeSidebar();
  }
}

function submitMessagePopup() {
  showPopup();
  startMessagePopupTimer();
  $("#popup").append("<h2>Send Message");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Do you want to send this message?");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='submitMessage()'>Send");
  $(".popupConfirm").append("<button onclick='{removePopup(); stopMessagePopupTimer();}'>Cancel");
  $(".popupConfirm button:last").focus();
}

function submitMessage() {
  removePopup();
  project.deselectAll();
  removeBoundingBox();
  removeSelectionPopup();
  var message = project.exportJSON();
  if(JSON.parse(message).length > 0) {
    $.ajax({
      url:"functions/createMessage",
      type:"POST",
      data:{"messageContent":message,"roomID":roomID,"receivers":JSON.stringify(messageCollection)},
      success:function(res) {
        showFloaty("Message sent!");
        closeSidebar();
        loadMain();
      },
      error:function(err) {
        console.log(err);
        showFloaty("no connection");
      },
      complete:function() {
        stopMessageTimer();
        stopMessagePopupTimer();
      },
    timeout: ajaxTimeout
    });
  }
  else {
    showFloaty("Message is empty!");
  }
}

function startMessagePopupTimer() {
  stopMessagePopupTimer();
  timerPopup = setTimeout(removePopup,messagePopupTime);
}

function stopMessagePopupTimer() {
  clearTimeout(timerPopup);
}

function startMessageTimer() {
  stopMessageTimer();
  timerMessage = setTimeout(function() {
    removePopup();
    closeSidebar();
    loadMain();
  },messageTime);
}

function stopMessageTimer() {
  clearTimeout(timerMessage);
}