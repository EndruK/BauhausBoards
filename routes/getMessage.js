var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next) {
  console.log(req.query.token);
  res.render('message');
});

router.get('/get',function(req,res,next) {
  var db = req.db;
  var token = req.query.token;
  var query = "SELECT message.m_date AS date, message.m_contentJSON AS content FROM msgTo INNER JOIN message ON mt_message=m_id WHERE mt_token=$token";
  db.get(query,{
    $token:token
  },function(err,row) {
    if(err) {
      res.status = 500;
      res.send("error: "+err);
    }
    else {
      res.send(row);
    }
  });
});

module.exports = router;