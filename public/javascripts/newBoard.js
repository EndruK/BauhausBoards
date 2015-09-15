$("#createNewBoard").on("click",newBoard);
$("#useOtherBoard").on("click",otherBoard);

function newBoard(event) {

}

function otherBoard(event) {
  $.ajax({
    url: "/functions/getBoards",
    type: "GET",
    success:function(res) {
      //TODO: display all boards
      console.log(res);
      $("#newBoard").append("<table id='otherBoards'>");
      $("#otherBoards").append("<th>");
      $("#otherBoards th:last").append("<td>ID</td><td>Room Name</td><td>Room Description</td>");
      res.forEach(function(key) {
        $("#otherBoards:last-child").insertAfter("<tr><td>"+key.id+"</td><td>"+key.room+"</td><td>"+key.description+"</td></tr>");
      });
    },
    error:function(err) {
      console.log("couldn't get boards");
    }
  });
}