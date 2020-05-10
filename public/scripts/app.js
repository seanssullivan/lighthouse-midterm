$(document).ready(function() {
  $('#jumbotron__block--button').click(renderMenu)

  $('menuItem__button--info').live("click", renderMenuItem);
})

const renderMenu = function(e) {
  $.ajax({
    method: "GET",
    url: "/menu"
  }).done(data => {
    $(this).parent().parent().parent().empty().append(data)
  });;
}

const renderMenuItem = function(e) {
  // $.ajax({
  //   method: "GET",
  //   url: "/menu"
  // })
  console.log('hello')
  console.log($( this ))
}