var pos = 'index';
var sideBarTimeout = 20000; //sidebar timeout in ms

//###DOM#######################################
$('.sidebar').on('click', '#btnMessage', loadMessageLanding);
$('#sidebarSwiper').swipe({
  swipeStatus:function(event,phase,direction,distance,duration,fingers) {
    if(phase=='move' && direction=="right") {
      $('.sidebar').addClass("open-sidebar");
      setTimeout(function(){
        console.log('close the sidebar');
        $('.sidebar').removeClass('open-sidebar');
      }, sideBarTimeout);
      return false;
    }
    if(phase=='move' && direction=='left') {
      $('.sidebar').removeClass('open-sidebar');
      return false;
    }
  }
});

//###FUNCTIONS#################################

function loadMessageLanding(event) {
  console.log('Messages');
  $('#content').text('Messages');
}