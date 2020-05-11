$(document).ready(function() {


<<<<<<< HEAD

  const renderMenuItem = function(e) {
    window.location.href = `/menu/${$( this ).parent().attr("id")}`

  }



  $('.menuItem__button--info').click(renderMenuItem);
})
=======
const renderMenu = function(e) {
  $.ajax({
    method: "GET",
    url: "/menu"
  }).done(data => {
    $(this).parent().parent().parent().empty().append(data)
  });
}

const renderMenuItem = function(e) {
  // $.ajax({
  //   method: "GET",
  //   url: "/menu"
  // })
  console.log('hello')
  console.log($( this ))
}
>>>>>>> master
