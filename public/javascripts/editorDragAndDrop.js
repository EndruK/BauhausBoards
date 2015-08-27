//set up the global paper scope
paper.install(window);

function drag(event) {
  console.log("drag");
  event.stopPropagation();
  event.preventDefault();
}

function drop(event) {
  console.log("drop");
  event.stopPropagation();
  event.preventDefault();
  console.log(event);
  var imgURL = event.originalEvent.dataTransfer.getData('URL');
  console.log(imgURL);
  if(imgURL) {
    console.log("hussar");
    //TODO: check url
    var raster = new Raster(imgURL);
    raster.position = view.center;
    if(raster.width > view.width) {
      raster2.scale(0.3);
    }
    addGifTicker();
  }
  event.stopPropagation();
  event.preventDefault();
}