var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus  = require('stylus');
var nib     = require('nib');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/bauhausboards.db');
var session = require('express-session');
var uuid = require('uuid');
var SHA256 = require("crypto-js/sha256");
var moment = require("moment");
var Twitter = require("twitter");
var paper = require('paper');
var email = require('emailjs');
var crypto = require('crypto');

var routes = require('./routes/index');
var functions = require('./routes/functions');

var app = express();
//use nib middleware for stylus
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
};

var client = new Twitter({
  consumer_key: 'QOjRYvg42VpTcMwb5dDIJqvIA',
  consumer_secret: '1v18gCaVPvO5aR7xUN0NC1XhIOAquGufKF0dXWIj6nJxvZOGjM',
  access_token_key: '2317344978-UvpuDUFdgqIjmwR2XX5eV6NDW9PeJXLOK2397f1',
  access_token_secret: 'j9s6ZgUCwcE0LwrKuKCbWWUVtv5HzlSHXGpB30etNc094'
});

var server = email.server.connect({
  host: "igor.medien.uni-weimar.de",
  //user: "",
  //password: "",
  port: 25,
  ssl: false
});


app.use(session({
  secret: 'ZMhX5IwFS9agS32KjR7iRKKR9bpsYUXvg7QRvaBSrfY=', //TODO: set this in setupFile
  name: 'BauhausBoardSession',
  genid: function(req) {
    return uuid.v4();
  },
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 15*60*1000 //15min
  },
  rolling:true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//define stylus to compile styl to css
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules/paper', express.static(__dirname + '/node_modules/paper'));
app.use('/node_modules/jquery', express.static(__dirname + '/node_modules/jquery'));
app.use('/node_modules/jquery-touchswipe', express.static(__dirname + '/node_modules/jquery-touchswipe'));
app.use('/node_modules/paper', express.static(__dirname + '/node_modules/paper'));
app.use('/node_modules/crypto-js', express.static(__dirname + '/node_modules/crypto-js'));
app.use('/node_modules/moment', express.static(__dirname + '/node_modules/moment'));
//app.use('/node_modules/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));

app.use(function(req, res, next) {
  req.db = db;
  req.moment = moment;
  req.twitter = client;
  req.mail = server;
  req.crypto = crypto;
  next();
});

app.use('/', routes);
app.use('/functions', functions);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = paper;
module.exports = app;