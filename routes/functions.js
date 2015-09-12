var express = require('express');
var router = express.Router();

router.get('/loadBoard', function(req, res, next) {
  var db = req.db;
  var collection = db.get('boardcollection');

  var boardID = req.param('boardID');
  console.log(boardID);

  collection.find({},{},function(e,docs){
    res.send(docs);
  });
  //res.send('respond with a resource');
});

module.exports = router;
