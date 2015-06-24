var pos = 'index';
//###DOM#######################################
$('.sidebar').on('click', '#btnMessage', loadMessageLanding);
$('#sidebarSwiper').swipe({
  swipeStatus:function(event,phase,direction,distance,duration,fingers) {
    if(phase=='move' && direction=="right") {
      $('.sidebar').addClass("open-sidebar");
      return false;
    }
    if(phase=="move" && direction=="left") {
      $('.sidebar').removeClass("open-sidebar");
      return false;
    }
  }
});

//###FUNCTIONS#################################

function loadMessageLanding(event) {
  console.log('Messages');
  $('#content').text('Messages');
}