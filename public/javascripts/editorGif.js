//set up the global paper scope
paper.install(window);
//update gifs
function gifUpdate() {
  var items = project.getItems({
    class: Raster,
    _image : checkGif
  });
  items.reverse().forEach(function(key) {
    var image = $("<img>").attr("src", $(key._image).attr("src"));
    var matrix = key.getGlobalMatrix();
    image.appendTo("#gifLayer");
    
  });
}

function checkGif(image) {
  if(endsWith($(image).attr("src"),".gif")) {
    return true;
  }
  return false;
}
function endsWith(str, suffix) {
  return. str.indexOf(suffix, str.length - suffix.length) !== -1;
}