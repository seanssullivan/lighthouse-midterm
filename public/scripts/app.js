$(document).ready(function() {
  $('#jumbotron__block--button').click(renderMenu)
})

const renderMenu = function(e) {
  $.ajax({
    method: "GET",
    url: "/menu"
  }).done(data => {
    $(this).parent().parent().parent().empty().append(data)
  });
}
