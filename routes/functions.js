var express = require('express');
var router = express.Router();

var sessionTimeAdmin = 1000*60*15; //15min
var sessionTimeUser = 1000*60*5; //5min

//to prevent injectionons use:
/*
var stmt = db.prepare();
stmt.run("INSERT INTO bla VALUES($id,$name)",{
  $id: 2,
  $name:"hallo"
});
stmt.finalize();
*/

//frontend
router.get('/getRoomUsers', function(req, res, next) {
  var db = req.db;
  var roomID = req.query.roomID;
  var query = 
    "SELECT " +
      "user.u_id AS userID, "+
      "user.u_name AS userName, "+
      "user.u_profilePic AS userProfilePic, "+
      "user.u_descr AS userDescription, "+
      "user.u_twitter AS userTwitter "+
    "FROM "+
      "user INNER JOIN roomusers ON user.u_id = roomusers.ru_user "+
    "WHERE "+
      "roomusers.ru_room = " + roomID;
  db.all(query,function(err,rows) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      res.send(rows);
    }
  });
});

//frontend
router.get('/getUserStatus', function(req, res, next) {
  var db = req.db;
  var userID = req.query.userID;

  var query = 
    "SELECT "+
      "s_text AS text, s_since AS since, s_until AS until " +
    "FROM status " +
    "WHERE s_user = " + userID + " "+
    "ORDER BY s_id DESC "+
    "LIMIT 1";
  db.get(query,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      res.send(row);
    }
  });
});

router.post('/setStatus', restrictUser, function(req,res) {
  var db = req.db;
  var userID = req.session.userID;
  var statusText = req.body.statusText;
  var statusUntil = req.body.statusUntil;
  console.log([userID,statusText,statusUntil]);
  var now = req.moment().format("YYYY-MM-DD\THH:mm");
  console.log(now);
  var query = "INSERT INTO status (s_user,s_text,s_since,s_until) "+
    "VALUES("+userID+",\""+statusText+"\",\""+now+"\",\""+statusUntil+"\")";
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: "+ err);
    }
    else {
      res.send("successfully created new status");
    }
  });
});

//frontend
router.get('/getUserContent', function(req,res,next) {
  var db = req.db;
  var userID = req.query.userID;

  var query = 
    "SELECT "+
      "c_contentJSON as content, c_date as date, c_background as background "+
    "FROM "+
      "content "+
    "WHERE c_user = " + userID + " "+
    "ORDER BY c_id DESC "+
    "LIMIT 1";
  db.get(query,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      res.send(row);
    }
  });
});

router.post('/changeUserContent', restrictUser, function(req,res) {
  var db = req.db;
  var userID = req.session.userID;
  var contentJSON = req.body.content;
  var now = req.moment().format("YYYY-MM-DD");
  var background = req.body.background;

  var query = "INSERT INTO content (c_user,c_date,c_contentJSON,c_background) "+
    "VALUES("+userID+",\""+now+"\",\'"+contentJSON+"\',\""+background+"\")";
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: "+ err);
    }
    else {
      res.send("successfully created new content");
    }
  });
});

router.post('/setContentBackground', restrictUser, function(req, res) {
  var db = req.db;
  var userID = req.session.userID;
  var background = req.body.background;
  var now = req.moment().format("YYYY-MM-DD");
  var query1 = "SELECT c_contentJSON FROM content WHERE c_user="+userID+" ORDER BY c_id DESC LIMIT 1";

  db.get(query1,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      var query2 = "INSERT INTO content (c_user,c_contentJSON,c_background) "+
        "VALUES ("+userID+",\'"+row.c_contentJSON+"\',\'"+background+"\')";
      db.run(query2,function(err,row) {
        if(err) {
          res.status = 500;
          res.send("error: "+ err);
        }
        else {
          res.send("successfully created new content");
        }
      });
    }
  });
});

//frontend and maybe backend???
router.post('/setBoardDim', function(req,res,next) {
  var db = req.db;
  var boardID = req.body.boardID;
  var width = req.body.width;
  var height = req.body.height;
  query = 
    "UPDATE board SET b_resX=" + width + ", b_resY=" + height + " " +
    "WHERE b_id="+boardID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: couldn't update board dimensions!");
    }
    else {
      res.send("successfully updated board dimensions");
    }
  });
});

//frontend
router.get('/getBoard', function(req,res,next) {
  var db = req.db;
  var boardID = req.query.boardID;
  var query = 
    "SELECT "+
      "b_resX AS boardResX, "+
      "b_resY AS boardResY, "+
      "b_room AS boardRoom "+
    "FROM board "+
    "WHERE b_id="+boardID;
  db.get(query,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      res.send(row);
    }
  });
});

//backend and frontend
router.get('/getBoards', function(req,res,next) {
  var db = req.db;
  var query = 
    "SELECT "+
      "board.b_id AS id, "+
      "board.b_resX AS resX, "+
      "board.b_resY AS resY, "+
      "room.r_id AS roomID, "+
      "room.r_name AS room, "+
      "room.r_descr AS description "+
    "FROM board LEFT JOIN room ON board.b_room = room.r_id";
  db.all(query,function(err, rows) {
    if(err) {
      res.status = 500;
      res.send("error"+err);
    }
    else {
      res.send(rows);
    }
  })
});

//backend
router.post('/newBoard', restrictAdmin, function(req, res) {
  var db = req.db;
  var resX = req.body.resX;
  var resY = req.body.resY;
  var query = "INSERT INTO board (b_resX,b_resY) VALUES("+resX+","+resY+")";
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("board successfully created");
    }
  });
});

router.post('/removeBoard', restrictAdmin, function(req, res) {
  var db = req.db;
  var boardID = req.body.boardID;
  var query = "DELETE FROM board WHERE b_id="+boardID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("board successfully deleted");
    }
  });
});

//delete?
router.get('/boardHasRoom', function(req,res,next) {
  var db = req.db;
  var boardID = req.query.boardID;
  var query = "SELECT b_room AS room FROM board WHERE b_id="+boardID;
  db.get(query,function(err,result) {
    //console.log(result);
    if(result && result.room != null) res.send(true);
    else res.send(false);
  });
});

//backend
router.get('/loadRooms', restrictAdmin, function(req,res) {
  var db = req.db;
  var query = "SELECT r_id AS id, r_name AS name, r_descr AS description FROM room";
  db.all(query,function(err, rows) {
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      res.send(rows);
    }
  })
});

//backend
router.post('/setBoardRoom', restrictAdmin, function(req,res) {
  var db = req.db;
  var boardID = req.body.boardID;
  var roomID = req.body.roomID;
  var query = "UPDATE board SET b_room='"+roomID+"' WHERE b_id="+boardID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: couldn't update board room!");
    }
    else {
      res.send("successfully updated board room");
    }
  });
});

//backend
router.post('/createNewRoom', restrictAdmin, function(req,res) {
  var db = req.db;
  var name = req.body.name;
  var description = req.body.description;
  var query = "INSERT INTO room(r_name,r_descr) VALUES ('"+name+"','"+description+"')";
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: "+ err);
    }
    else {
      res.send("successfully created new room");
    }
  });
});

//backend
router.post('/deleteRoom', restrictAdmin, function(req,res) {
  var db = req.db;
  var roomID = req.body.roomID;
  var query = "DELETE FROM room WHERE r_id="+roomID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("room successfully deleted");
    }
  })
});

//delete?
router.get('/getRoom', function(req,res,next) {
  var db = req.db;
  var roomID = req.query.roomID
  var query = "SELECT r_name AS name, r_descr AS description FROM room WHERE r_id="+roomID;
  db.get(query,function(err, row) {
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      res.send(row);
    }
  })
});

//backend
router.get('/getBoardsForRoom', restrictAdmin, function(req,res) {
  var db = req.db;
  var roomID = req.query.roomID;
  var query = "SELECT board.b_id AS boardID FROM room INNER JOIN board ON room.r_id = board.b_room WHERE room.r_id="+roomID;
  db.all(query,function(err, rows) {
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      res.send(rows);
    }
  });
});

//backend
router.post('/setRoomName', restrictAdmin, function(req,res) {
  var db = req.db;
  var roomID = req.body.roomID;
  var name = req.body.name;
  var query = "UPDATE room SET r_name='"+name+"' WHERE r_id="+roomID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("room name successfully updated");
    }
  });
});

//backend
router.post('/setRoomDescription', restrictAdmin, function(req,res) {
  var db = req.db;
  var roomID = req.body.roomID;
  var description = req.body.description;
  var query = "UPDATE room SET r_descr='"+description+"' WHERE r_id="+roomID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("room description successfully updated");
    }
  });
});

//backend
router.get('/getUsers', restrictAdmin, function(req,res) {
  var db = req.db;
  var query = 
    "SELECT "+
      "user.u_id AS userID, "+
      "user.u_name AS userName, "+
      "user.u_date AS userCreationDate, "+
      "user.u_mail AS userMail, "+
      "user.u_profilePic AS userProfilePic, "+
      "user.u_descr AS userDescription, "+
      "user.u_twitter AS userTwitter, "+
      "user.u_adminFlag AS userAdminFlag "+
    "FROM "+
      "user";
  db.all(query,function(err,rows) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send(rows);
    }
  });
});
/*
//frontend
router.get('/getUser', function(req,res,next) {
  var db = req.db;
  var userID = req.query.userID;
  var query = 
    "SELECT "+
      "u_name AS userName, "+
      "u_profilePic AS userProfilePic "+
    "FROM "+
      "user "+
    "WHERE "+
      "u_id="+userID;
  db.get(query,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send(row);
    }
  });
});*/

//backend
router.post('/createNewUser', restrictAdmin, function(req,res) {
  var db = req.db;
  var name = req.body.userName;
  var pw = req.body.userPassword;
  var date = new Date();
  var jsonDate = date.toJSON();
  jsonDate = jsonDate.split("T")[0];
  var mail = req.body.userMail;
  var profilePic = req.body.userProfilePic;
  var description = req.body.userDescription;
  var twitter = req.body.userTwitter;
  var adminFlag = req.body.userTwitter;
  if(adminFlag) adminFlag = 1;
  else adminFlag = 0;
  var pin = req.body.userPin;
  var query = 
    "INSERT INTO user (u_name,u_pw,u_date,u_mail,u_profilePic,u_descr,u_twitter,u_adminFlag,u_pin) "+
    "VALUES ('"+name+"','"+pw+"','"+jsonDate+"','"+mail+"','"+profilePic+"','"+description+"','"+twitter+"',"+adminFlag+",'"+pin+"')";
  //console.log(query);
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("user successfully created");
    }
  });
});

//backend and frontend
router.get('/checkMailExists',function(req,res, next) {
  var db = req.db;
  var mail = req.query.mail;
  var query = "SELECT * FROM user WHERE u_mail='"+mail+"'";
  db.get(query,function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      if(row) {
        res.send(true);
      }
      else {
        res.send(false);
      }
    }
  });
});

//backend
router.post('/removeUser',restrictAdmin,function(req,res) {
  var db = req.db;
  var userID = req.body.userID;
  var query1 = "DELETE FROM roomusers WHERE ru_user="+userID;
  var query2 = "DELETE FROM user WHERE u_id="+userID;
  var success1 = false;
  var success2 = false;
  var error1 = "";
  var error2 = "";
  db.run(query1,function(err,row) {
    if(err) {
      error1 = err;
    }
    else {
      success1 = true;
    }
  });
  db.run(query2,function(err,row) {
    if(err) {
      error2 = err;
    }
    else {
      success2 = true;
    }
  });
  if(success1 && success2) {
    res.send("user successfully deleted");
  }
  else {
    res.status = 500;
    res.send([error1,error2]);
  }
});

//backend and frontend
router.get('/getUsersForRoom',function(req,res,next) {
  var db = req.db;
  var roomID = req.query.roomID;
  var query = 
    "SELECT "+
      "user.u_id AS userID, "+
      "user.u_profilePic AS userProfilePic, "+
      "user.u_name AS userName "+
    "FROM "+
      "roomusers INNER JOIN user ON roomusers.ru_user=user.u_id "+
    "WHERE "+
      "ru_room="+roomID;
  db.all(query,function(err,rows) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send(rows);
    }
  });
});

//backend
router.get('/getUsersNotInRoom',restrictAdmin,function(req,res) {
  var db = req.db;
  var roomID = req.query.roomID;
  var query = 
  "SELECT "+
    "u_id AS userID, u_name AS userName, u_profilePic AS userProfilePic "+
  "FROM user "+
  "WHERE "+
    "u_id NOT IN "+
      "(select ru_user as u_id from roomusers where ru_room="+roomID+")";
  db.all(query,function(err,rows) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send(rows);
    }
  });
});

//backend
router.post('/addUserToRoom',restrictAdmin,function(req,res) {
  var db = req.db;
  var roomID = req.body.roomID;
  var userID = req.body.userID;
  var query = 
    "INSERT INTO roomusers (ru_user,ru_room) VALUES ("+userID+","+roomID+")";
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("user successfully added to room");
    }
  });
});

//backend
router.post('/removeUserFromRoom',restrictAdmin,function(req,res) {
  var db = req.db;
  var roomID = req.body.roomID;
  var userID = req.body.userID;
  var query = 
    "DELETE FROM roomusers WHERE ru_user="+userID+" AND ru_room="+roomID;
  db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("user successfully removed from room");
    }
  });
});

//backend
router.get('/getUserForChange',restrictAdmin,function(req,res) {
  var db =req.db;
  var userID = req.query.userID;
  var query =
    "SELECT "+
      "u_name AS userName, "+
      "u_mail AS userMail, "+
      "u_profilePic AS userProfilePic, "+
      "u_descr AS userDescription, "+
      "u_twitter AS userTwitter, "+
      "u_adminFlag AS userAdminFlag "+
    "FROM user "+
    "WHERE u_id="+userID;
  db.get(query,function(err, row) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send(row);
    }
  });
});

//backend
router.post('/changeUser',restrictAdmin,function(req,res) {
  var db = req.db;
  var userID = req.body.userID;
  var name = req.body.userName;
  var pw = req.body.userPassword;
  var mail = req.body.userMail;
  var profilePic = req.body.userProfilePic;
  var description = req.body.userDescription;
  var twitter = req.body.userTwitter;
  var adminFlag = req.body.userTwitter;
  if(adminFlag) adminFlag = 1;
  else adminFlag = 0;
  var pin = req.body.userPin;
  var query = 
    "UPDATE user "+
    "SET "+
      "u_name='"+name+"', ";
  if(pw) {
    query += "u_pw='"+pw+"', ";
  }
  query +=
      "u_mail='"+mail+"', "+
      "u_profilePic='"+profilePic+"', "+
      "u_descr='"+description+"', "+
      "u_twitter='"+twitter+"', "+
      "u_adminFlag="+adminFlag+" ";
  if(pin) {
    query += ",u_pin="+pin+" ";
  }
  query +=
    "WHERE u_id="+userID;
    db.run(query,function(err) {
    if(err) {
      res.status = 500;
      res.send("error: " + err);
    }
    else {
      res.send("user successfully updated");
    }
  });
});

//backend but without restriction
router.post('/loginAdmin', function(req, res, next) {
  var db = req.db;
  var mail = req.body.mail;
  var pw = req.body.pw;
  var query = "SELECT * FROM user WHERE u_mail='"+mail+"' AND u_pw='"+pw+"' AND u_adminFlag=1";
  db.get(query,function(err, row) {
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      if(row && row.u_mail === mail && row.u_pw === pw) {
        req.session.userID = row.u_id;
        req.session.email = row.u_mail;
        req.session.name = row.u_name;
        req.session.auth = true;
        req.session.admin = true;
        req.session.adminTime = Date.now();
        res.send("success");
      }
      else {
        res.status = 401;
        res.send("could not login");
      }
    }
  });
});

router.post('/loginUserPin',function(req,res,next) {
  var db = req.db;
  var userID = req.body.userID;
  var userPin = req.body.userPin;
  var query = "SELECT * FROM user WHERE u_id="+userID+" AND u_pin='"+userPin+"'";
  db.get(query,function(err,row) {
    //console.log(row);
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      if(row && row.u_id == userID && row.u_pin == userPin) {
        req.session.userID = userID;
        req.session.pinTime = Date.now();
        if(row.u_adminFlag) req.session.admin = true;
        else req.session.admin = false;
        req.session.type = "pin";
        res.send("success");
      }
      else {
        res.status = 401;
        res.send("could not login");
      }
    }
  });
});


router.post('/logoutAdmin', function(req, res, next) {
  req.session.destroy();
  res.send(true);
});

router.get('/logoutUser',function(req,res,next) {
  req.session.destroy();
  res.send(true);
});

router.get('/checkAdminSession', function(req,res,next) {
  if(req.session.admin == true) {
    res.send(true);
  }
  else {
    res.send(false);
  }
})

router.get('/checkUserSession', restrictUser, function(req,res) {
  res.send('session valid');
});

function restrictAdmin(req,res,next) {
  if(req.session.admin == true) {
    if((req.session.adminTime + sessionTimeAdmin) > Date.now()) {
      req.session.adminTime = Date.now();
      next();
    }
    else {
      req.session.error = 'Session expired!';
      req.session.destroy();
      res.send('Session expired');
    }
  }
  else {
    req.session.error = 'Access denied!';
    res.send('ACCESS DENIED');
  }
}

function restrictUser(req,res,next) {
  if(req.session.type == "pin") {
    if((req.session.pinTime + sessionTimeUser) > Date.now()) {
      req.session.pinTime = Date.now();
      next();
    }
    else {
      req.session.error = 'Session expired!';
      req.session.destroy();
      res.send('Session expired');
    }
  }
  else {
    req.session.error = "Access denied!";
    res.send('ACCESS DENIED');
  }
}

module.exports = router;