$('.sidebar').on('click', '.btnSetStatus', function(){checkSession(loadChangeStatus)});

function loadChangeStatus() {
  $('#header').text('change Status');
  showSidebar('sidebarChangeStatus');
  updateTimer();
}