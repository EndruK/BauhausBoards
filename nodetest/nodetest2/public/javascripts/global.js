var userListData = [];
//###DOM#############################
$(document).ready(function() {
  populateTable();
});
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
$('#btnAddUser').on('click', addUser);
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
//###FUNCTIONS#######################
function populateTable() {
  var tableContent = '';
  $.getJSON('/users/userlist', function(data) {
    userListData = data;
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td>';
      tableContent += '<a href="#" class="linkshowuser" rel="' 
        + this.username + '">' + this.username + '</a>';
      tableContent += '</td>';
      tableContent += '<td>';
      tableContent += this.email;
      tableContent += '</td>';
      tableContent += '<td>';
      tableContent += '<a href="#" class="linkdeleteuser" rel="' 
        + this._id + '">delete</a>';
      tableContent += '</td>';
      tableContent += '</tr>';
    });
    $('#userList table tbody').html(tableContent);
  });
};
function showUserInfo(event) {
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  var arrayPos = userListData.map(function(arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUserName);
  var thisUserObj = userListData[arrayPos];
  $('#userInfoName').text(" " + thisUserObj.fullname);
  $('#userInfoAge').text(" " + thisUserObj.age);
  $('#userInfoGender').text(" " + thisUserObj.gender);
  $('#userInfoLocation').text(" " + thisUserObj.location);
};
function addUser(event) {
  event.preventDefault();
  var errorCount = 0;
  $('#addUser input').each(function(index,val) {
    if($(this).val() === '') { errorCount++; }
  });
  if(errorCount === 0) {
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserMail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response) {
      if(response.msg === '') {
        $('#addUser fieldset input').val('');
        populateTable();
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    alert('Please fill all fields');
    return false;
  }
};
function deleteUser(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to delete this user?');
  if(confirmation === true) {
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response) {
      if(response.msg !== '') {
        alert('Error: ' + response.msg);
      }
      populateTable();
    });
  }
  else {
    return false;
  }
};