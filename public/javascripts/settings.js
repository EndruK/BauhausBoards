$("#getTabletDim").on("click",saveDim);

function saveDim(event) {
  var height = $(window).height();
  var width  = $(window).width();

  var boardID = 1;

  console.log([width,height]);
  $.ajax({
    url: "/functions/setTabletDim",
    type: "POST",
    data:{"boardID":boardID,"width":width,"height":height},
    success:function(response) {
      if(!startsWith(response,"error")) {
        console.log(response);
      }
      else {
        console.log(response);
      }
    },
    error:function(error) {
      console.log("couldn't update the tablet dimensions");
    }
  })
}


function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}