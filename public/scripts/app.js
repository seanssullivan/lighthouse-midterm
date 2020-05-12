$(document).ready(function() {

  // $('.itemInfo__topping--add').click(add)

  $('.menuItem__button--info').click(renderMenuItem);
})

const renderMenuItem = function(e) {
  window.location.href = `/menu/${$( this ).parent().attr("id")}`
}