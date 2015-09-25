function loadRoomSettings(event) {
  console.log("settings");
  var content = $("#content");
  content.empty();
  content.append("<h2>Room Settings");
  loadRooms();
  content.append("<div id='back' class='containerTile containerTileAbs'>Back");
  $("#back").on("click", showSettings);
}

function loadRooms() {
  $("#rooms").empty();
  $("#newRoomForm").empty();
  $.ajax({
    url: "functions/loadRooms",
    type: "GET",
    success:function(data) {
      console.log(data);
      $("#content").append("<table id='boardSettings' class='ajaxTable'>");
      var rooms = $("#boardSettings");
      rooms.append("<thead><th>Room-ID<th>Roomname<th>Description<th colspan='3'>");
      rooms.append("<tbody>");
      rooms.append("<tr value='newRoom'><td style='text-align:center' colspan='6' onclick='setRoom(\"newRoom\")'>New Room");
      data.forEach(function(key) {
        rooms.append("<tr>");
        var lastTR = $("#content tbody tr:last");
        lastTR.append("<td>"+key.id);
        lastTR.append("<td>"+key.name);
        lastTR.append("<td>"+key.description);
        lastTR.append("<td style='text-align:center'>");
        $("#content tbody tr:last td:last")
          .append("<button onclick='deleteRoom("+key.id+")'>Delete</button>");
        lastTR.append("<td style='text-align:center'>");
        $("#content tbody tr:last td:last")
          .append("<button onclick='updateRoom("+key.id+")'>Change</button>");
        lastTR.append("<td style='text-align:center'>");
        $("#content tbody tr:last td:last")
          .append("<button onclick='setRoom("+key.id+")'>Set</button>");
      });
    },
    error:function(error) {
      console.log("couldn't get rooms");
    }
  });
}

function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}
function setRoom(id) {
  var val = id;
  if(val == "newRoom") {
    //var result = confirm("Create a new room?");
    //$("#rooms").empty();
    var newRoom = $("#newRoom");
    newRoom.append("<form onsubmit='submitForm()' id='newRoomForm'>");
    var newRoomForm = $("#newRoomForm");
    newRoomForm.submit(function(event) {
      event.preventDefault();
    });
    newRoomForm.append("Room Name:<br><input name='roomname' maxlength='40'>");
    newRoomForm.append("<br>Description(Optional):<br>");
    newRoomForm.append("<textarea name='roomdescription'></textarea>");
    newRoomForm.append("<br><button class='cancelForm' onclick='cancelForm()'>Cancel");
    newRoomForm.append("<button class='submitForm' onclick='submitForm('createNew')'>Submit");

  }
  else {
    var result = confirm("Do you really want to set the room for this board?");
    if(!result) return;
    $.ajax({
      url: "/functions/setBoardRoom",
      type: "POST",
      data: {"boardID":boardID,"roomID":val},
      success:function(data) {
        //alert("Room for Board " + boardID + " set to Room " + val);
        loadRoomSettings();
      },
      error:function(error) {
        console.log("couldn't update board room");
      }
    });
  }
}

function cancelForm() {
  var result = confirm("Cancel room creation?");
  if(result) loadRooms();
}
function submitForm(task) {
  var roomname = $("#newRoomForm input").val();
  var description = $("#newRoomForm textarea").val();
  if(!roomname) {
    $("#newRoomForm input").css("border","2px solid red");
    return;
  }
  if(task == 'createNew') {
    $.ajax({
      url:"/functions/createNewRoom",
      type: "POST",
      data: {"name":roomname,"description":description},
      success:function(res) {
        loadRooms();
      },
      error:function(err) {
        console.log("couldn't create room");
      }
    });
  }
  else if(task == 'update') {

  }
}
function deleteRoom(id) {
  var result = confirm("Do you really want to delete room " + id + "?");
  if(!result) return;
  //TODO: check if boards are connected to this room
  $.ajax({
    url:"/functions/deleteRoom",
    type:"POST",
    data:{"roomID":id},
    success:function(res) {
      console.log("room successfully deleted");
      loadRooms();
    },
    error:function(err) {
      console.log("couldn't delete room");
    }
  });
}
function updateRoom(id) {
  //$("#rooms").empty();
  var newRoom = $("#newRoom");
  newRoom.append("<form onsubmit='submitForm()' id='newRoomForm'>");
  var newRoomForm = $("#newRoomForm");
  newRoomForm.submit(function(event) {
    event.preventDefault();
  });
  $.ajax({
    url:"/functions/getRoom",
    type: "GET",
    data: {"roomID":id},
    success:function(res) {
      newRoomForm.append("Room Name:<br><input name='roomname' maxlength='40' value='"+res.name+"'>");
      newRoomForm.append("<br>Description(Optional):<br>");
      newRoomForm.append("<textarea name='roomdescription'>"+res.description+"</textarea>");
      newRoomForm.append("<br><button class='cancelForm' onclick='loadRooms()'>Cancel");
      newRoomForm.append("<button class='submitForm' onclick='submitForm('update')'>Submit");
    },
    error:function(err) {
      console.log("couldn't get room");
    }
  });
}