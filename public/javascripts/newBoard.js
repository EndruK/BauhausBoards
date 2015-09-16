$("#createNewBoard").on("click",newBoard);
$("#useOtherBoard").on("click",otherBoard);


function loadNewBoard() {
  $("#header").css("visibility","hidden");
  $(".sidebar").css("visibility","hidden");
  $("#EditorCanvas").css("visibility","hidden");
  $("#tabletSizePreview").css("visibility","hidden");
  var newBoard = $("#newBoard");
  newBoard.css({
    "visibility" : "visible",
    "left" : "-=" + newBoard.width()/2 + "px"
  });
}

function newBoard(event) {
  $("#otherBoards").css("visibility","hidden");
  var result = confirm("Create a new board?");
  if(result) {
    var resX = $(window).width();
    var resY = $(window).height();

    $.ajax({
      url: "/functions/newBoard",
      type: "POST",
      data: {"resX":resX-1,"resY":resY-1},
      success:function(result) {
        console.log(result);
        window.location.replace("/?BID="+result.id);
      },
      error:function(error) {
        console.log("couldn't create new board");
      }
    });
  }
}

function otherBoard(event) {
  $("#otherBoards").empty();
  $.ajax({
    url: "/functions/getBoards",
    type: "GET",
    success:function(res) {
      var otherBoards = $("#otherBoards");
      otherBoards.css("visibility","visible");
      var appendString = "<thead><tr><th>ID<th>room<th>description<th>resX<th>resY";
      appendString += "<tbody>"
      res.forEach(function(key) {
        appendString += "<tr value="+key.id+">"+
          "<td>"+key.id;
        appendString +="<td>";
        if(key.room) appendString += key.room;
        appendString +="<td>";
        if(key.description) appendString += key.description;
        appendString += "<td>"+key.resX+
          "<td>"+key.resY;
      });
      otherBoards.append(appendString);
      $("#otherBoards tbody tr").on("click",redirectTo);
    },
    error:function(err) {
      console.log("couldn't get boards");
    }
  });
}


function redirectTo(event) {
  var val=$(this).attr("value");
  window.location.replace("/?BID="+val);
}