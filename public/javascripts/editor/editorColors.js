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
var colorContainerOpen;
var colorContainerTimeout = 5000;
var colorContainerTimeoutHandler;
$('.sidebar').on('click', '.btnEditorColor', openColorPopup);


$(document).ready(function() {
  colorContainerOpen = false;
  activeColor = colors["black"];
  $("#sidebarCreateMessage .sidebarUpper").css("color",rgbToHex(activeColor));
});

/*function handleButtonClick(event) {
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
}*/

function openColorPopup(event) {
  var width = 5 * 50;
  var height = 4 * 50;
  var time = 150;
  openEditorPopup(this,width,height,function() {
    $("#editorPopup").append("<div id='white' class='colorTile'>");
    $("#editorPopup").append("<div id='pink' class='colorTile'>");
    $("#editorPopup").append("<div id='yellow' class='colorTile'>");
    $("#editorPopup").append("<div id='yellowgreen' class='colorTile'>");
    $("#editorPopup").append("<div id='greenblue' class='colorTile'>");
    $("#editorPopup").append("<div class='clear'>");
    $("#editorPopup").append("<div id='lightgrey' class='colorTile'>");
    $("#editorPopup").append("<div id='lightred' class='colorTile'>");
    $("#editorPopup").append("<div id='orange' class='colorTile'>");
    $("#editorPopup").append("<div id='lightgreen' class='colorTile'>");
    $("#editorPopup").append("<div id='lightblue' class='colorTile'>");
    $("#editorPopup").append("<div class='clear'>");
    $("#editorPopup").append("<div id='darkgrey' class='colorTile'>");
    $("#editorPopup").append("<div id='red' class='colorTile'>");
    $("#editorPopup").append("<div id='darkorange' class='colorTile'>");
    $("#editorPopup").append("<div id='green' class='colorTile'>");
    $("#editorPopup").append("<div id='blue' class='colorTile'>");
    $("#editorPopup").append("<div class='clear'>");
    $("#editorPopup").append("<div id='black' class='colorTile'>");
    $("#editorPopup").append("<div id='darkred' class='colorTile'>");
    $("#editorPopup").append("<div id='brown' class='colorTile'>");
    $("#editorPopup").append("<div id='darkgreen' class='colorTile'>");
    $("#editorPopup").append("<div id='darkblue' class='colorTile'>");
    $(".colorTile").on("click", switchColor);
  });
}

function switchColor(event) {
  startEditorPopupTimer();
  var clicked = $(this).attr("id");
  activeColor = colors[clicked];
  switchButtonColor();
  var items = project.selectedItems;
  if(items.length > 0) {
    items.forEach(function(key) {
      key.fillColor = rgbToHex(activeColor);
    });
    view.update();
  }
}

function switchButtonColor() {
  $(".btnEditorColor").css("color",rgbToHex(activeColor));
  $(".btnEditorPen").css("color",rgbToHex(activeColor));
  $(".btnEditorText").css("color",rgbToHex(activeColor));
  $(".btnEditorStroke").css("color",rgbToHex(activeColor));
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
  activeColor = colors["black"];
}