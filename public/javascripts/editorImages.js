//set up the global paper scope
paper.install(window);
$('.sidebar').on('click', '.imgTEST', imageTest);

function imageTest(event) {
  console.log("imageTest");
  var url = prompt("Enter an image URL");
  if(url){
    undo_saveState();
    var raster = new Raster(url);
    raster.position = view.center;
    addGifTicker();
    if(raster.width > view.width) {
      raster2.scale(0.3);
    }
  }
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
  

  // a little string contains function
  if (typeof String.prototype.contains === 'undefined') {
    String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
  }
});
function update_gifs(){
  // find all Gifs in project, very simple method, prone to failure
  gif_items = project.getItems({
    class : Raster,
    _image : function(val){
      return val ? $(val).attr("src").contains(".gif") : false;
    }
  });
  

  var gifLayer = $("#gifLayer");
  var gifsOnLayer = gifLayer.children('img').map(function(key) {
    var url = $(this).attr('src');
    //if is the editor gif set
    var inItems = false;
    gif_items.reverse().forEach(function(gif,i){
      var itemURL = $(gif._image).attr("src");
      if(url == itemURL) {
        inItems = true;
      }
    });
    if(inItems) return url;
    //else remove the gif from gif layer
    else {
      var img = $("img[src$='"+url+"']");
      img.remove();
    }
  }).get();


  // then for each gif raster, make an HTML image copy
  gif_items.reverse().forEach(function(gif,i){
    var url = $(gif._image).attr("src");
    var displayed = false;
    var item;
    gifsOnLayer.forEach(function(key) {
      if(url == key) {
        displayed = true;
        item = key;
      }
    });
    if(!displayed) {
      gif.bringToFront();
      var img = $('<img>').attr('src', url);
      var gm = gif.getGlobalMatrix();
      // add the image to the dedicated gif layer and copy transform
      img.appendTo('#gifLayer');
      img.css({
        position: "absolute",
        left: "0px",
        transform:  "matrix("+gm._a+","+gm._c+","+gm._b+","+gm._d+","+gm._tx+","+gm._ty+") translate(-50%,-50%)",
        transformOrigin: "0% 0%"
      })
    }
    else {
      var img = $("img[src$='"+item+"']");
      var gm = gif.getGlobalMatrix();
      img.css({
        position: "absolute",
        left: "0px",
        transform:  "matrix("+gm._a+","+gm._c+","+gm._b+","+gm._d+","+gm._tx+","+gm._ty+") translate(-50%,-50%)",
        transformOrigin: "0% 0%"
      })
    }
  });
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