var express = require('express');
var router = express.Router();

router.get('/loadBoard', function(req, res, next) {
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

router.post('/setTabletDim', function(req,res,next) {
  var db = req.db;
  var boardID = req.body.boardID;
  var width = req.body.width;
  var height = req.body.height;
  console.log([width,height]);
  //check if there is an entry
  var query = 
    "SELECT "+
      "count(*) AS count "+
    "FROM "+
      "board "+
    "WHERE "+
      "b_id = " + boardID;
  db.get(query,function(err,row) {
    if(row.count != 1) {
      //no entriy is there!!!
      res.send("error: boardID not found!");
    }
    else {
      query = 
        "UPDATE board SET b_resX=" + width + ", b_resY=" + height + " "
        "WHERE b_id="+boardID;
      db.run(query,function(err,result) {
        if(err) {
          res.status = 500;
          res.send("error: couldn't update board dimensions!");
        }
        else {
          res.send("successfully updated board dimensions");
        }
      });
    }
  });
});

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

module.exports = router;