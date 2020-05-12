$(document).ready(function() {



  const renderMenuItem = function(e) {
    window.location.href = `/menu/${$( this ).parent().attr("id")}`

  }



  $('.menuItem__button--info').click(renderMenuItem);
})
