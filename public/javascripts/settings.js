$("#getTabletDim").on("click",saveDim);

function saveDim(event) {
  var height = $(window).height();
  var width  = $(window).width();

  $.ajax({
    url: "/functions/setBoardDim",
    type: "POST",
    data:{"boardID":boardID,"width":width,"height":height},
    success:function(response) {
      if(!startsWith(response,"error")) {
        console.log(response);
      }
      else {
        console.log(response);
      }
    },
    error:function(error) {
      console.log("couldn't update the tablet dimensions");
    }
  })
}

function loadRooms() {
  $("#rooms").empty();
  $("#newRoomForm").empty();
  $.ajax({
    url: "functions/loadRooms",
    type: "GET",
    success:function(data) {
      var rooms = $("#rooms");
      rooms.append("<thead><th>Room-ID<th>Roomname<th>Description<th>");
      rooms.append("<tbody>");
      rooms.append("<tr value='newRoom'><td colspan='4' onclick='setRoom(\"newRoom\")'>New Room");
      data.forEach(function(key) {
        rooms.append("<tr>");
        var lastTR = $("#rooms tbody tr:last");
        lastTR.append("<td>"+key.id);
        lastTR.append("<td>"+key.name);
        lastTR.append("<td>"+key.description);
        lastTR.append("<td>");
        var lastTD = $("#rooms tbody tr:last td:last");
        lastTD.append("<button class='submitForm' value='"+key.id+"' onclick='setRoom("+key.id+")'>Set</button>")
        lastTD.append("<button class='submitForm' value='"+key.id+"' onclick='deleteRoom("+key.id+")'>delete</button>");
      });
      $.ajax({
        url: "/functions/getBoards",
        type: "GET",
        success:function(res) {
          var boards = res;
          var tableRows = $("#rooms tbody").children();
          boards.forEach(function(key) {
            if(key.id == boardID && key.roomID) {
              tableRows.each(function() {
                if($(this).attr("value") == key.roomID.toString()) {
                  $(this).css({
                    "text-decoration":"underline",
                    "cursor":"default",
                    "background-color":"none"
                  });
                  $(this).attr("value","none");
                }
              })
            }
          });
        },
        error:function(err) {
          console.log("couldn't get the boards");
        }
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
    $("#rooms").empty();
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
    newRoomForm.append("<button class='submitForm' onclick='submitForm()'>Submit");

  }
  else if(val == "none") {
    return;
  }
  else {
    $.ajax({
      url: "/functions/setBoardRoom",
      type: "POST",
      data: {"boardID":boardID,"roomID":val},
      success:function(data) {
        alert("Room for Board " + boardID + " set to Room " + val);
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
function submitForm() {
  var roomname = $("#newRoomForm input").val();
  var description = $("#newRoomForm textarea").val();
  if(!roomname) {
    $("#newRoomForm input").css("border","2px solid red");
    return;
  }
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