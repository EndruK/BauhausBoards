function loadRoomSettings(event) {
  var content = $("#content");
  content.empty();
  content.append("<h2>Room Settings");
  printRoomTable();
  $("#back").remove();
  $("body").append("<div title='Back' id='back' class='containerTile containerTileAbs secondAbsTile'><span class='glyphicon glyphicon-backward'>");
  $("#back").on("click", function() {
    $("#back").remove();
    showSettings();
    removePopup();
  });
}

function printRoomTable() {
  var content = $("#content");
  content.append("<table id='roomTable' class='ajaxTable'>");
  $.ajax({
    url:"/functions/loadRooms",
    type:"GET",
    success:function(res) {
      var roomTable = $("#roomTable");
      roomTable.append("<thead><tr><th>Room ID<th>Room Name<th>Room Description<th colspan='4'>");
      roomTable.append("<tbody>");
      roomTable.append("<tr value='newRoom'><td height='40px' colspan='7' style='text-align:center' onclick='createNewRoomPopup()'>new Room");
      $("#roomTable tbody tr:first td").css({
        "font-weight":"bold",
        "cursor":"pointer"
      });
      res.forEach(function(key) {
        roomTable.children("tbody").append("<tr value='"+key.id+"'>");
        var row = $("#roomTable tbody tr:last");
        row.append("<td>"+key.id);
        row.append("<td>"+key.name);
        row.append("<td>"+key.description);
        row.append("<td style='max-width:60px'><button onclick='deleteRoomPopup("+key.id+")'>DELETE");
        row.append("<td style='max-width:70px'><button onclick='setRoomNamePopup("+key.id+",\""+key.name+"\")'>SET ROOM NAME");
        row.append("<td style='max-width:80px'><button onclick='setRoomDescriptionPopup("+key.id+",\""+key.description+"\")'>SET ROOM DESCRIPTION");
      });
    },
    error:function(err) {
      console.log("couldn't load rooms");
    }
  });
}

function createNewRoomPopup() {
  showPopup();
  $("#popup").append("<h2>Create new Room");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert room parameters.");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Name:");
  $(".popupConfirm").append("<input id='roomName'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<label>Description:");
  $(".popupConfirm").append("<textarea id='roomDescription'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<button onclick='createNewRoom()'>Create");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function createNewRoom() {
  var name = $("#roomName").val();
  var description = $("#roomDescription").val();
  $.ajax({
    url:"/functions/createNewRoom",
    type:"POST",
    data:{"name":name,"description":description},
    success:function(res) {
      removePopup();
      loadRoomSettings();
      showFloaty("Room successfully created.");
    },
    error:function(err) {
      console.log("couldn't create new room");
    }
  });
}

function deleteRoomPopup(roomID) {
  showPopup();
  $("#popup").append("<h2>Delete Room");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Do you really want to remove Room "+roomID+"?");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<p id=countBoards>");
  $(".popupConfirm").append("<div id=boardListContainer>");
  $.ajax({
    url:"/functions/getBoardsForRoom",
    type:"GET",
    data:{"roomID":roomID},
    success:function(res) {
      if(res) {
        var count = 0;
        $("#boardListContainer").append("<table id='connectedBoardsTable' class='ajaxTable'>");
        $("#boardListContainer table").append("<thead><th>BoardID<th>");
        $("#boardListContainer table").append("<tbody>");
        res.forEach(function(key) {
          $("#boardListContainer table tbody").append("<tr>");
          $("#boardListContainer table tbody:last").append("<td>"+key.boardID);
          $("#boardListContainer table tbody:last").append("<td style='width:100px'><button onclick='goToBoard("+key.boardID+")'>Go to Board");
          count += 1;
        });
        $("#countBoards").text("There are currently "+count+" Boards connected to this Room.");
        if(count == 0) {
          $("#connectedBoardsTable").remove();
        }
      }
    },
    error:function(err) {
      console.log("couldn't get board count for room");
    }
  });
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<button onclick='deleteRoom("+roomID+")'>Delete");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function deleteRoom(roomID) {
  $.ajax({
    url:"/functions/deleteRoom",
    type:"POST",
    data:{"roomID":roomID},
    success:function(res) {
      removePopup();
      loadRoomSettings();
      showFloaty("Room successfully deleted.");
    },
    error:function(err) {
      console.log("couldn't delete room");
    }
  });
}

function setRoomNamePopup(roomID,name) {
  showPopup();
  $("#popup").append("<h2>Set Room name");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert a new room name for room "+roomID+".");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Name:");
  $(".popupConfirm").append("<input id='roomNameinput' value=\""+name+"\">");
  $(".popupConfirm").append("<button onclick='setRoomName("+roomID+")'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function setRoomName(roomID) {
  var name = $("#roomNameinput").val();
  console.log(name);
  if(!name || name == "") {
    showFloaty("The room should have a Name!");
    return;
  }
  else {
    $.ajax({
      url:"functions/setRoomName",
      type:"POST",
      data:{"roomID":roomID,"name":name},
      success:function(res) {
        removePopup();
        loadRoomSettings();
        showFloaty("Room name successfully updated.");
      },
      error:function(err) {
        console.log("couldn't set room name");
      }
    });
  }
}

function setRoomDescriptionPopup(roomID,description) {
  showPopup();
  $("#popup").append("<h2>Set room description");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert a new room description for room "+roomID+".");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Description:");
  $(".popupConfirm").append("<textarea id='roomDescriptionArea'>"+description);
  $(".popupConfirm").append("<button onclick='setRoomDescription("+roomID+")'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function setRoomDescription(roomID) {
  var description = $("#roomDescriptionArea").val();
  $.ajax({
    url:"/functions/setRoomDescription",
    type:"POST",
    data:{"roomID":roomID,"description":description},
    success:function(res) {
        removePopup();
        loadRoomSettings();
        showFloaty("Room description successfully updated.");
    },
    error:function(err) {
      console.log("couldn't set room description");
    }
  });
}