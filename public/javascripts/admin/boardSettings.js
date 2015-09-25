function loadBoardSettings(event) {
  var content = $("#content");
  content.empty();
  content.append("<h2>Board Settings");
  printBoardTable();
  $("#back").remove();
  $("body").append("<div title='Back' id='back' class='containerTile containerTileAbs secondAbsTile'><span class='glyphicon glyphicon-backward'>");
  $("#back").on("click", function() {
    $("#back").remove();
    showSettings();
    removePopup();
  });
}

function printBoardTable() {
  var content = $("#content");
  content.append("<table id='boardTable' class='ajaxTable'>");
  $.ajax({
    url: "/functions/getBoards",
    type: "GET",
    success:function(res) {
      var boardTable = $("#boardTable");
      boardTable.append("<thead><tr><th>Board ID<th>Room Name<th>Room Description<th>Board Resolution<th colspan='4'>");
      boardTable.append("<tbody>");
      boardTable.append("<tr value='newBoard'><td height='40px' colspan='8' style='text-align:center' onclick='createNewBoardPopup()'>new Board");
      $("#boardTable tbody tr:first td").css({
        "font-weight":"bold",
        "cursor":"pointer"
      });
      res.forEach(function(key) {
        boardTable.children("tbody").append("<tr value='"+key.id+"'>");
        var row = $("#boardTable tbody tr:last");
        row.append("<td>"+key.id);
        if(key.room) {
          row.append("<td>"+key.room);
          row.append("<td>"+key.description);
        }
        else {
          row.append("<td>-");
          row.append("<td>-");
        }
        row.append("<td>"+key.resX+":"+key.resY);
        row.append("<td><button onclick='deleteBoardPopup("+key.id+")'>DELETE");
        var room;
        if(key.roomID) {
          room = key.roomID;
        }
        else {
          room = 0;
        }
        row.append("<td><button onclick='setBoardRoomPopup("+key.id+","+room+")'>SET ROOM");
        row.append("<td><button onclick='setBoardResolutionPopup("+key.id+")'>SET RESOLUTION");
        row.append("<td><button onclick='goToBoard("+key.id+")'>Go to Board");
      });
    },
    error:function(err) {
      console.log("couldn't get boards");
    }
  });
}

function createNewBoardPopup() {
  showPopup();
  $("#popup").append("<h2>Create new Board");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Do you really want to create a new Board?");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='createNewBoard()'>Create");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function createNewBoard() {
  $.ajax({
    url:"/functions/newBoard",
    type: "POST",
    data: {"resX":$(window).width(),"resY":$(window).height()},
    success:function(res) {
      removePopup();
      loadBoardSettings();
      showFloaty("Board successfully created.<br><br>Don't forget to set the Board resolution!");
    },
    error:function(err) {
      console.log("couldn't create new board");
    }
  });
}

function deleteBoardPopup(boardID) {
  showPopup();
  $("#popup").append("<h2>Delete Board");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Do you really want to remove Board "+boardID+"?");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='deleteBoard("+boardID+")'>Delete");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function deleteBoard(boardID) {
  $.ajax({
    url:"/functions/removeBoard",
    type:"POST",
    data: {"boardID":boardID},
    success:function(res) {
      removePopup();
      loadBoardSettings();
      showFloaty("Board successfully deleted.");
    },
    error:function(err) {
      console.log("couldn't create new board");
    }
  });
}

function setBoardResolutionPopup(boardID) {
  showPopup();
  $("#popup").append("<h2>Set Resolution of Board "+boardID);
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Set Automatically");
  $("#popup").append("<button title='set to current window size' onclick='setBoardRessolution("+boardID+",\"aut\")'>Set");
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
  $(".popupConfirm").append("<button onclick='setBoardRessolution("+boardID+",\"man\")'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  getBoardResolution(boardID);
}
function setBoardRessolution(boardID,type) {
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
    url:"/functions/setBoardDim",
    type:"POST",
    data:{"boardID":boardID,"width":resX,"height":resY},
    success:function(res) {
      removePopup();
      loadBoardSettings();
      showFloaty("Resolution for Board " + boardID + " successfully updated.");
    },
    error:function(err) {
      console.log("couldn't set board resolution");
    }
  });
}

function setBoardRoomPopup(boardID,roomID) {
  showPopup();
  $("#popup").append("<h2>Set Room of Board "+boardID);
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Select the room which the Board should show.");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Room:");
  $(".popupConfirm").append("<select id='selectRoom'>");
  $(".popupConfirm select").append("<option selected='selected' value=none>");
  $.ajax({
    url:"/functions/loadRooms",
    type:"GET",
    success:function(res) {
      res.forEach(function(key) {
        if(roomID != 0 && key.id == roomID) {
          $(".popupConfirm select option:first").removeAttr("selected");
          $(".popupConfirm select").append("<option selected='selected' value="+key.id+">"+key.name);
        }
        else {
          $(".popupConfirm select").append("<option value="+key.id+">"+key.name);
        }
      });
    },
    error:function(err) {
      console.log("couldn't get rooms");
    }
  });
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<button onclick='setBoardRoom("+boardID+")'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function setBoardRoom(boardID) {
  var selected = $("#selectRoom").val();
  if(selected == 'none') {
    selected = "";
  }
  $.ajax({
    url:"/functions/setBoardRoom",
    type:"POST",
    data:{"boardID":boardID,"roomID":selected},
    success:function(res) {
      removePopup();
      loadBoardSettings();
      if($("#selectRoom").val() == 'none') {
        showFloaty("Room for Board " + boardID + " successfully resetted.");
      }
      else {
        showFloaty("Room for Board " + boardID + " successfully set to " + selected + ".");
      }
    },
    error:function(err) {
      console.log("couldn't update board room");
    }
  });
}

function getBoardResolution(boardID) {
  $.ajax({
    url:"/functions/getBoardDim",
    type:"GET",
    data:{"boardID":boardID},
    success:function(res) {
      $("#resX").val(res.resX);
      $("#resY").val(res.resY);
    },
    error:function(err) {
      console.log("couldn't get board resolution");
    }
  });
}