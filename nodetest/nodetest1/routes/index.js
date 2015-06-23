var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: 'Hello World!' });
});

/* GET Userlist page */
router.get('/userlist', function(req, res, next) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({}, {}, function(e, docs){
		res.render('userlist', {
			"userlist":docs
		});
	});
});

/* GET New User page */
router.get('/newuser', function(req, res, next) {
  res.render('newuser', {title:"Add new user"});
});

/* POST to Add User */
router.post('/adduser', function(req, res, next) {
  var db = req.db;
  var userName = req.body.username;
  var userMail = req.body.usermail;
  var collection = db.get('usercollection');
  collection.insert({
    "username":userName,
    "email":userMail
  }, function(err, doc) {
    if(err) {
      res.send("A problem occured during a dataset add")
    }
    else {
      res.redirect("userlist");
    }
  });
});

module.exports = router;
