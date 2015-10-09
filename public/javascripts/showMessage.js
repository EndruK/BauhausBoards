$(document).ready(showMessage);
paper.install(window);
function showMessage() {
  if(!token)
  var token = location.href.split("token=")[1];
  if(!token) return;
  paper.setup('EditorCanvas');
  $.ajax({
    url:"/message/get",
    type:"GET",
    data:{"token":token},
    success:function(res) {
      console.log(res);
      project.importJSON(res.content);
    },
    error:function(err) {
      console.log("couldn't get message");
    },
    timeout: 8000
  });
}