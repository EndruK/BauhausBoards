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
  event.stopPropagation();
  event.preventDefault();
  //get image url from browser drop
  if(event.originalEvent.dataTransfer.types.length > 0 && event.originalEvent.dataTransfer.getData('URL') != "") {
    var imgURL = event.originalEvent.dataTransfer.getData('URL');
    console.log(imgURL);
    drawImage(imgURL);
  }

  //upload image first
  else if(event.originalEvent.dataTransfer.files.length > 0) {
    //user has more than one element uploaded?
    var files = event.originalEvent.dataTransfer.files;
    console.log(files);
    for(var i=0; i< files.length; i++) {
      var key = files[i];
      var r = new FileReader();
      var url;
      r.onload = function(event) {
        var result = event.target.result;
        var image  = result.substr(result.indexOf(",") + 1);
        //do ajax to imgur
        $.ajax({
          url: "https://api.imgur.com/3/image",
          type: "post",
          headers: {
            Authorization: "Client-ID 395d5a7dec70b4a"
          },
          data: {
            image: image
          },
          dataType: "json",
          success: function(result,status){
            url = result.data.link;
            drawImage(url);
          },
          error: function(input) {
            console.log(input);
            alert("Error while uploading image!");
          }
        });
      }
      r.readAsDataURL(key);
    }
  }
}
function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
function drawImage(imgURL) {
  if(imgURL && checkURL(imgURL)) {
    var raster = new Raster(imgURL);
    raster.position = view.center;
    if(raster.width > view.width) {
      raster2.scale(0.3);
    }
    addGifTicker();
  }
}