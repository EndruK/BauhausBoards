var express = require('express');
var router = express.Router();

router.get('/loadBoard', function(req, res, next) {
  var db = req.db;
  var boardID = req.query.boardID;

  //var query = "select user.u_name, room.r_name FROM roomusers, user, room WHERE roomusers.ru_user = user.u_id AND roomusers.ru_room = room.r_id";
  var query = "select user.u_id AS id, user.u_name AS name, user.u_profilePic AS profilePic, user.u_descr AS description, user.u_twitter AS twitter FROM user INNER JOIN roomusers ON user.u_id = roomusers.ru_user INNER JOIN room ON roomusers.ru_room = room.r_id INNER JOIN board ON board.b_room = room.r_id WHERE board.b_id = " + boardID;

  db.all(query,function(err,rows) {
    //console.log(rows);
    res.contentType('application/json');
    res.send(rows);
  })
});

module.exports = router;