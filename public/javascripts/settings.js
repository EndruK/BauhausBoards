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
  $.ajax({
    url: "functions/loadRooms",
    type: "GET",
    success:function(data) {
      var rooms = $("#rooms");
      rooms.append("<thead><th>Room-ID<th>Roomname<th>Description");
      rooms.append("<tbody>");
      rooms.append("<tr value='newRoom'><td colspan='3'>New Room");
      data.forEach(function(key) {
        rooms.append("<tr value='"+key.id+"'><td>"+key.id+"<td>"+key.name+"<td>"+key.description);
      });
      $("#rooms tbody tr").on("click",setRoom);
    },
    error:function(error) {
      console.log("couldn't get rooms");
    }
  });
  //TODO: add board values in the header
}

function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}
function setRoom(event) {
  var val = $(this).attr("value");
  if(val == "newRoom") {
    //TODO: create new Room
  }
  else {
    $.ajax({
      url: "/functions/setBoardRoom",
      type: "POST",
      data: {"boardID":boardID,"roomID":val},
      success:function(data) {
        alert("Room for Board " + boardID + " set to Room " + val);
      },
      error:function(error) {
        console.log("couldn't update board room");
      }
    });
    //TODO: set the Room
  }
}