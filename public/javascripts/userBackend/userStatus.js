function loadChangeStatus() {
  showPopup();
  $("#popup").append("<h2>Set Status");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Set your status");
  $("#popup").append("<hr>");
  $("#popup").append("<div id='statusDiv'>");
  $("#popup #statusDiv").append("<label>Status:");
  $("#popup #statusDiv").append("<input type='text' id='userStatusInput' maxlength='30'><br>");
  var now = moment().format("YYYY-MM-DD\THH:mm");
  $("#popup #statusDiv").append("<div class='clear'>");
  $("#popup #statusDiv").append("<label>Until:");
  $("#popup #statusDiv").append("<input id='timeInput' type='datetime-local' min='"+now+"' value='"+now+"'><br>");
  $("#popup #statusDiv").append("<div class='clear'>");
  $("#popup #statusDiv").append("<button onclick='setTime(5)'>5min");
  $("#popup #statusDiv").append("<button onclick='setTime(10)'>10min");
  $("#popup #statusDiv").append("<button onclick='setTime(30)'>30min");
  $("#popup #statusDiv").append("<button onclick='setTime(60)'>60min");
  $("#popup #statusDiv").append("<button onclick='setTime(90)'>90min");
  $("#popup").append("<div class='clear'>");
  $("#popup").append("<br>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='setStatus()'>Set");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
  $.ajax({
    url:"/functions/getUserStatus",
    type:"GET",
    data:{"userID":authenticatedUser},
    success:function(res) {
      if(res) {
        var date = moment();
        var until = moment(res.until);
        if(until > date) {
          console.log(res.text);
          $("#userStatusInput").val(res.text);
          $("#timeInput").val(until.format("YYYY-MM-DD\THH:mm"));
        }
      }
    },
    error:function(err) {
      console.log("couldn't get user status");
    }
  });
}

function setTime(time) {
  var time = moment().add(time,"m").format("YYYY-MM-DD\THH:mm");
  $("#timeInput").val(time);
}

function setStatus() {
  var text = $("#userStatusInput").val();
  var time = $("#timeInput").val();
  var now = moment();
  if(!text || !time || time < now) {
    if(!text) {
      $("#userStatusInput").css("border","solid 2px red");
    }
    else {
      $("#userStatusInput").removeAttr("style");
    }
    if(!time || time < now) {
      $("#timeInput").css("border","solid 2px red");
    }
    else {
      $("#timeInput").removeAttr("style");
    }
    return;
  }
  $.ajax({
    url:"/functions/setStatus",
    type:"POST",
    data:{"userID":authenticatedUser,"statusText":text,"statusUntil":time},
    success:function(res) {
      removePopup();
      checkSession(showUserBackend);
      showFloaty("Status successfully updated.");
    },
    error:function(err) {
      console.log("couldn't set user status");
    }
  });
}