function loadUserSettings() {
  var content = $("#content");
  content.empty();
  content.append("<h2>User Settings");
  printUserTable();
  $("#back").remove();
  $("body").append("<div title='Back' id='back' class='containerTile containerTileAbs secondAbsTile'><span class='glyphicon glyphicon-backward'>");
  $("#back").on("click", function() {
    $("#back").remove();
    showSettings();
    removePopup();
  });
}

function printUserTable() {
  var content = $("#content");
  content.append("<table id='userTable' class='ajaxTable'>");
  $.ajax({
    url:"/functions/getUsers",
    type:"GET",
    success:function(res) {
      var userTable = $("#userTable");
      userTable.append("<thead><tr><th>ID<th>profile pic<th>Name<th>Description<th>Mail<th>creation date<th>admin<th colspan='2'>");
      userTable.append("<tbody>");
      userTable.append("<tr value='newUser'><td height='40px' colspan='9' style='text-align:center' onclick='createNewUserPopup()'>new User");
      $("#userTable tbody tr:first td").css({
        "font-weight":"bold",
        "cursor":"pointer"
      });
      res.forEach(function(key) {
        userTable.children("tbody").append("<tr value='"+key.userID+"'>");
        var row = $("#userTable tbody tr:last");
        row.append("<td>"+key.userID);
        var imageURL = key.userProfilePic;
        console.log(imageURL);
        if(!imageURL || imageURL == null) {
          imageURL = "images/default-user.png";
        }
        row.append("<td style='width:100px'><img style='max-width:100px' src=\""+imageURL+"\">");
        row.append("<td>"+key.userName);
        var description = "";
        if(key.userDescription) {
          description = key.userDescription.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        row.append("<td>"+description);
        row.append("<td>"+key.userMail);
        row.append("<td>"+key.userCreationDate);
        row.append("<td>"+key.userAdminFlag);
        row.append("<td><button onclick='deleteUserPopup("+key.userID+")'>DELETE");
        row.append("<td><button onclick='changeUserPopup("+key.userID+")'>CHANGE USER");
      });
    },
    error:function(err) {
      console.log("couldn't get users");
    }
  });
}

function createNewUserPopup() {
  checkSessionIntermediate();
  showPopup();
  $("#popup").append("<h2>Create new User");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Insert user parameters.");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<label>Name*:");
  $(".popupConfirm").append("<input id='userName' maxlength='50'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<label>Mail*:");
  $(".popupConfirm").append("<input type='email' id='userMail' maxlength='60'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<label>Password*:");
  $(".popupConfirm").append("<input id='userPassword' type='password'>");
  $(".popupConfirm").append("<input id='userPasswordConfirm' type='password'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<label>Pin*:");
  $(".popupConfirm").append("<input type='password' id='userPin' maxlength='4'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<label>Description:");
  $(".popupConfirm").append("<textarea id='userDescription'>");
  $(".popupConfirm").append("<fieldset>");
  $(".popupConfirm fieldset").append("<label>Profile Pic:");
  $(".popupConfirm fieldset").append("<div id='picDiv'>");
  $("#picDiv").append("<input checked='checked' type='radio' id='picDefault' value=0>Default");
  $("#picDiv").append("<br>");
  $("#picDiv").append("<input type='radio' id='picURL' value=1>URL");
  $("#picDiv").append("<input type='text' id='picURLInput'>");
  $("#picDiv").append("<div class='clear'>");
  $("#picDiv").append("<button id='picUploadButton' onclick='uploadImage()'>upload Image");
  $("#picDiv").append("<input id='picUploadInput' accept='image/*' name='file' type='file' style='display:none'>");
  $("#picDefault").on("click",checkButton);
  $("#picURL").on("click",checkButton);
  $("#picURLInput").on("click",enterInput);
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<label>Twitter:");
  $(".popupConfirm").append("<input id='userTwitter' type='text'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<label>Admin:");
  $(".popupConfirm").append("<div id='adminDiv'>");
  $("#adminDiv").append("<input id='userAdminFlag' type='checkbox'>");
  $(".popupConfirm").append("<div class='clear'>");
  $(".popupConfirm").append("<br>");
  $(".popupConfirm").append("<button onclick='createNewUser()'>Create");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function createNewUser() {
  var name = $("#userName").val();
  var mail = $("#userMail").val();
  var password = $("#userPassword").val();
  var passwordConfirm = $("#userPasswordConfirm").val();
  var picType = getPictureType();
  var description = $("#userDescription").val();
  var url;
  if(picType == 0) {
    url = "";
  }
  else if(picType == 1) {
    url = $("#picURLInput").val();
  }
  else {
    console.log("error with the radio buttons");
  }
  var twitter = $("#userTwitter").val();
  var adminFlag = $("#userAdminFlag").prop("checked");
  var pin = $("#userPin").val();
  if(!name || !mail || !password || !passwordConfirm || password != passwordConfirm || !validateEmail(mail) || !pin || !validatePin(pin)) {
    if(!name) {
      $("#userName").css("border","2px solid red");
    }
    else {
      $("#userName").removeAttr("style");
    }
    if(!mail || !validateEmail(mail)) {
      $("#userMail").css("border","2px solid red");
    }
    else {
      $("#userMail").removeAttr("style");
    }
    if(!password || !passwordConfirm || password != passwordConfirm) {
      $("#userPassword").css("border","2px solid red");
      $("#userPasswordConfirm").css("border","2px solid red");
      $("#userPassword").val("");
      $("#userPasswordConfirm").val("");
    }
    else {
      $("#userPassword").removeAttr("style");
      $("#userPasswordConfirm").removeAttr("style");
    }
    if(!pin || !validatePin(pin)) {
      $("#userPin").css("border","2px solid red");
    }
    else {
      $("#userPin").removeAttr("style");
    }
    return;
  }
  $("#userName").removeAttr("style");
  $("#userMail").removeAttr("style");
  $("#userPassword").removeAttr("style");
  $("#userPasswordConfirm").removeAttr("style");
  $("#userPin").removeAttr("style");
  $.ajax({
    url:"/functions/checkMailExists",
    type:"GET",
    data:{"mail":mail},
    success:function(res) {
      if(!res) {
        var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        $.ajax({
          url:"/functions/createNewUser",
          type:"POST",
          data: {
            "userName":name,
            "userPassword":hash,
            "userMail":mail,
            "userProfilePic":url,
            "userDescription":description,
            "userTwitter":twitter,
            "userAdminFlag":adminFlag,
            "userPin":pin
          },
          success:function(res) {
            removePopup();
            loadUserSettings();
            showFloaty("User successfully created.");
          },
          error:function(err) {
            console.log("couldn't create new user");
          }
        });
      }
      else {
        $("#userMail").css("border","2px solid red");
        showFloaty("Mail address already exists!");
      }
    },
    error:function(err) {
      console.log("couldn't check mail address");
    }
  });
}

function deleteUserPopup(userID) {
  checkSessionIntermediate();
  showPopup();
  $("#popup").append("<h2>Delete User");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Do you really want to remove User "+userID+"?");
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='deleteUser("+userID+")'>Delete");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function deleteUser(userID) {
  $.ajax({
    url:"/functions/removeUser",
    type:"POST",
    data: {"userID":userID},
    success:function(res) {
      removePopup();
      loadUserSettings();
      showFloaty("User successfully deleted.");
    },
    error:function(err) {
      console.log("couldn't delete user");
    }
  });
}

function changeUserPopup(userID) {
  checkSessionIntermediate();
  showPopup();
  $("#popup").append("<h2>Change User");
  $("#popup").append("<hr>");
  $("#popup").append("<h4>Change parameters for User "+userID);
  $("#popup").append("<hr>");
  $("#popup").append("<div class='popupConfirm'>");
  $(".popupConfirm").append("<button onclick='changeUser("+userID+")'>Change");
  $(".popupConfirm").append("<button onclick='removePopup()'>Cancel");
}

function changeUser(userID) {

}

function checkButton(event) {
  var checkboxes = $("#picDiv input:radio");
  checkboxes.each(function() {
    this.checked = false;
  })
  this.checked = true;
}

function getPictureType() {
  var value = -1;
  var inputs = $("#picDiv input:radio");
  inputs.each(function() {
    if($(this).prop("checked")) {
      value = $(this).attr("value");
    }
  });
  return value;
}

function enterInput(event) {
  $("#picURL").trigger("click");
}

function uploadImage() {
  $("#picURL").trigger("click");
  var test = $("#picUploadInput").trigger("click");
  $("#picUploadInput").change(function(event) {
    var file = event.target.files[0];
    if(!file || !file.type.match(/image.*/)) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
      var result = event.target.result;
      var image  = result.substr(result.indexOf(",") + 1);
      showFloaty("Uploading Image...",1000*60);
      $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        headers: {
          Authorization: "Client-ID 395d5a7dec70b4a"
        },
        data: {
          image: image
        },
        dataType: "json",
        success: function(res){
          url = res.data.link;
          $("#picURLInput").val(url);
          showFloaty("Image successfully uploaded!");
        },
        error: function(err) {
          console.log(err);
          showFloaty("Error while uploading image!");
        },
        complete: function() {
          //TODO remove uploading indicator
        }
      });
    };
    reader.readAsDataURL(file);
  });
}

function validateEmail(mail) {
  if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validatePin(pin) {
  if(/^\d\d\d\d$/.test(pin)) {
    return true;
  }
  return false;
}