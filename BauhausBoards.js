var express = require('express');
var stylus  = require('stylus');
var nib     = require('nib');

//define to use the express framework
var app = express();
//use nib middleware for stylus
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
};
//define the folder for the jade views
app.set('views', __dirname + '/views');
//define jade to compile jade to html
app.set('view engine', 'jade');
//define a logger to log incomming requests to console
app.use(express.logger('dev'));
//define stylus to compile styl to css
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
//define static middleware to serve static files in /public
//this folder is then accessable on the webserver
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  //express provides render and renders the view
  //.render('viewname',ProbertyObject)
  res.render('index',
  { title : 'Home',
    condition : true }
  );
});
app.get('/test', function (req, res) {
  res.render('test',
  {

  });
});
app.listen(3000);