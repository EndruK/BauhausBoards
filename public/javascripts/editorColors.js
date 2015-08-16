var colors = {
  "white" :       [255,255,255],
  "lightgrey" :   [170,170,170],
  "darkgrey" :    [85 ,85 ,85 ],
  "black" :       [0  ,0  ,0  ],
  "pink" :        [255,105,180],
  "lightred" :    [231,76 ,60 ],
  "red" :         [255,0  ,0  ],
  "darkred" :     [128,0  ,0  ],
  "yellow" :      [255,255,0  ],
  "orange" :      [255,165,0  ],
  "darkorange" :  [255,140,0  ],
  "brown" :       [139,69 ,19 ],
  "yellowgreen" : [173,255,47 ],
  "lightgreen" :  [124,252,0  ],
  "green" :       [0  ,255,0  ],
  "darkgreen" :   [0  ,100,0  ],
  "greenblue" :   [0  ,250,154],
  "lightblue" :   [135,206,250],
  "blue" :        [65 ,105,225],
  "darkblue" :    [0  ,0  ,128]
}
var activeColor
var colorContainerOpen;
var colorContainerTimeout = 5000;
var colorContainerTimeoutHandler;
$(".sidebar").on("click",".btnColor",handleButtonClick);
$(".sidebar").on("click",".colorContainer",switchColor);

$(document).ready(function() {
  colorContainerOpen = false;
  activeColor = colors["black"];
});

function handleButtonClick(event) {
  console.log("clicked on color button");
  updateTimer();
  if(!colorContainerOpen) {
    openColorContainer();
    updateColorContainerTimeout();
  }
  else {
    closeColorContainer();
    clearTimeout(colorContainerTimeoutHandler);
  }
}
function openColorContainer() {
  var container = $(".colors");
  container.css("visibility","visible");
  container.css("position","relative");
  colorContainerOpen = true;
}
function closeColorContainer() {
  var container = $(".colors");
  container.css("visibility","hidden");
  container.css("position","absolute");
  colorContainerOpen = false;
}

function switchColor(event) {
  var clicked = $(this).attr("id");
  var previous = $(".activeColor");
  if(clicked != previous.attr("id")) {
    previous.removeClass("activeColor");
    $(this).addClass("activeColor");
    //clicked.css("border-color","rgba(255,0,0,1)");
    //console.log($(this).attr("id"));
    activeColor = colors[clicked];
    //console.log(activeColor);
    updateTimer();
    updateColorContainerTimeout();
    var button = $(".btnColor");
    if(clicked == "black" || clicked == "darkblue") {
      button.css("color","white");
    }
    else {
      button.css("color","black");
    }
    var buttonColor = "rgba("+activeColor[0]+","+activeColor[1]+","+activeColor[2]+",1)";
    button.css("background-color",buttonColor);
    var strokeBar = $(".strokeBar");
    strokeBar.css("background-color",buttonColor);
  }
}
function updateColorContainerTimeout() {
  clearTimeout(colorContainerTimeoutHandler);
  colorContainerTimeoutHandler = setTimeout(closeColorContainer,colorContainerTimeout);
}


function colorToHex(color) {
  var hexColor = color.toString(16);
  if(hexColor.length == 1) {
    return "0"+hexColor;
  }
  return hexColor;
}

function rgbToHex(rgb) {
  return "#" + colorToHex(rgb[0])+colorToHex(rgb[1])+colorToHex(rgb[2]);
}
function resetColor() {
  var previous = $(".activeColor");
  previous.removeClass("activeColor");
  var black = $("#black");
  black.addClass("activeColor");
  var button = $(".btnColor");
  button.css("color","white");
  button.css("background-color","black");
}