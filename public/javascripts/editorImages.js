//set up the global paper scope
paper.install(window);
$('.sidebar').on('click', '.imgTEST', imageTest);

function imageTest(event) {
  console.log("imageTest");
  /*var raster = new Raster('images/monkey.jpg');
  raster.position = view.center;
  raster.scale(0.5);*/
  var raster2 = new Raster('images/jack.gif');
  raster2.position = view.center;
  //raster2.scale(0.5);
}
var gifUpdate = null;
 /* 
 * Gif functions
 * by Errol Wood
 * Smartboards2 project
 * https://github.com/errollw/smartboards2
 * 
 */
$(document).ready(function(){
  addGifTicker();

  // a little string contains function
  if (typeof String.prototype.contains === 'undefined') {
    String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
  }
});
function update_gifs(){
  // first empty the gif_container layer
  $('#gifLayer').empty();

  // find all Gifs in project, very simple method, prone to failure
  gif_items = project.getItems({
    class : Raster,
    _image : function(val){
      return val ? $(val).attr("src").contains(".gif") : false;
    }
  });
  // then for each gif raster, make an HTML image copy
  gif_items.reverse().forEach(function(gif,i){

    var img = $('<img>').attr('src', $(gif._image).attr("src"));
    var gm = gif.getGlobalMatrix();
    // add the image to the dedicated gif layer and copy transform
    img.appendTo('#gifLayer');
    img.css({
      position: "absolute",
      left: "0px",
      transform:  "matrix("+gm._a+","+gm._c+","+gm._b+","+gm._d+","+gm._tx+","+gm._ty+") translate(-50%,-50%)",
      transformOrigin: "0% 0%"
    })
  });
  //show_gifs();
}

function hide_gifs(){
  $('#gifLayer').hide();
}
function show_gifs(){
  $('#gifLayer').show();
}
function removeGifTicker() {
  hide_gifs();
}
function addGifTicker() {
  gifUpdate = setInterval(update_gifs, 500);
}