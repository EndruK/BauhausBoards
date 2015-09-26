var express = require('express');
var router = express.Router();

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
router.get('/loadBoardUsers', function(req, res, next) {
  var db = req.db;
  var boardID = req.query.boardID;
  var query = 
    "SELECT " +
      "user.u_id AS id, "+
      "user.u_name AS name, "+
      "user.u_profilePic AS profilePic, "+
      "user.u_descr AS description, "+
      "user.u_twitter AS twitter "+
    "FROM "+
      "user INNER JOIN roomusers ON user.u_id = roomusers.ru_user "+
      "INNER JOIN room ON roomusers.ru_room = room.r_id "+
      "INNER JOIN board ON board.b_room = room.r_id "+
    "WHERE "+
      "board.b_id = " + boardID;
  db.all(query,function(err,rows) {
    if(err) {
      res.status = 500;
      res.send("error:"+err);
    }
    else {
      res.contentType('application/json');
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
    "WHERE s_user = " + userID;
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

//frontend
router.get('/getUserContent', function(req,res,next) {
  var db = req.db;
  var userID = req.query.userID;

  var query = 
    "SELECT "+
      "c_contentJSON as content, c_date as date, c_background as background "+
    "FROM "+
      "content "+
    "WHERE c_user = " + userID;
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
router.get('/getBoardDim', function(req,res,next) {
  var db = req.db;
  var boardID = req.query.boardID;
  var query = "SELECT b_resX AS resX, b_resY AS resY FROM board WHERE b_id="+boardID;
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

//backend
router.get('/getBoards', restrictAdmin, function(req,res) {
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
  var query = "INSERT INTO board(b_resX,b_resY) VALUES("+resX+","+resY+")";
  db.run(query,function(err,result){
    //console.log([err,result]);
  },function() {
    //console.log(this);
    if(this[0] != null) {
      res.status = 500;
      res.send("error: couldn't insert new board");
    }
    else {
      res.send({"id":this.lastID});
    }
  });
});

router.post('/removeBoard', restrictAdmin, function(req, res) {
  var db = req.db;
  var boardID = req.body.boardID;
  var query = "DELETE FROM board WHERE b_id="+boardID;
  db.run(query,function(err,res) {
    //console.log([err,result]);
  },function() {
    if(this[0] != null) {
      res.status = 500;
      res.send("error: couldn't remove board. "+this[0]);
    }
    else {
      res.send("removed board");
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
    "VALUES ('"+name+"','"+pw+"','"+jsonDate+"','"+mail+"','"+profilePic+"','"+description+"','"+twitter+"',"+adminFlag+","+pin+")";
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
        req.session.email = row.u_mail;
        req.session.name = row.u_name;
        req.session.auth = true;
        req.session.admin = true;
        req.session.time = Date.now();
        res.send("success");
      }
      else {
        res.status = 401;
        res.send("could not login");
      }
    }
  });
});

router.get('/checkAdminSession', function(req,res,next) {
  if(req.session.admin == true) {
    res.send(true);
  }
  else {
    res.send(false);
  }
})

router.post('/logoutAdmin', function(req, res, next) {
  req.session.destroy();
  res.send(true);
});


function restrictAdmin(req,res,next) {
  var mytime = 1000*60*15; //15min
  //var mytime = 1000*60;
  if(req.session.admin == true) {
    //console.log([req.session.time,Date.now()]);
    if((req.session.time + mytime) > Date.now()) {
      req.session.time = Date.now();
      next();
    }
    else {
      req.session.destroy();
      req.session.error = 'Session expired!';
      res.send('ACCESS DENIED');
    }
  }
  else {
    req.session.error = 'Access denied!';
    res.send('ACCESS DENIED');
  }
}

module.exports = router;