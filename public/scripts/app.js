$(document).ready(function() {

  $('.itemInfo__topping--add').click(addTopping)
  $('.itemInfo__topping--minus').click(removeTopping)
  $('.itemInfo__add').children().last().click(addItem)

  $('.menuItem__button--info').click(renderMenuItem);
})

const refreshCheckout = function() {
  const order = window.localStorage.getItem('order')
  if (order === undefined) return
  $('checkout__list').empty()
}

const renderMenuItem = function(e) {
  window.location.href = `/menu/${$( this ).parent().attr("id")}`
}

const addItem = function() {
  const storedOrder = window.localStorage.getItem('order')
  const parentId = $( this ).parent().parent().parent().attr("id");
  let order = JSON.parse(storedOrder)
  if (order === null) {
    order = {}
    order.item = {
      [parentId]: {
        quantity: 0
      }
    }
  } else if (order.item[parentId].quantity === undefined) {
    console.log(order.item[parentId].quantity)
    order.item = {
      [parentId]: {
        quantity: 0
      }
    }
  }

  order.item[parentId].quantity++
  
  window.localStorage.setItem('order', JSON.stringify(order))
}

const addTopping = function() {
  const storedOrder = window.localStorage.getItem('order')
  const parentId = $( this ).parent().parent().parent().parent().attr("id")
  const toppingId = $( this ).parent().attr("id")
  let order = JSON.parse(storedOrder)
  if (order === null) {
    order = {}
    order.item = {
      [parentId]: {
        extras: {}
      }
    }
  } else if (order.item[parentId].extras === undefined) {
    order.item[parentId].extras= {}
  }

  if (order.item[parentId].extras[toppingId] === undefined) {
    order.item[parentId].extras[toppingId] = 1
  } else {
    order.item[parentId].extras[toppingId]++
  }

  window.localStorage.setItem('order', JSON.stringify(order))
}

const removeTopping = function() {
  const storedOrder = window.localStorage.getItem('order')
  const parentId = $( this ).parent().parent().parent().parent().attr("id")
  const toppingId = $( this ).parent().attr("id")
  let order;
  if (storedOrder) {
    order = JSON.parse(storedOrder)
  } else {
    order = {}
    order.item = {
      [id]: {
        extras: {}
      }
    }
  }
  
  if (order.item[parentId].extras[toppingId] === 0) {
    // order.item[parentId].extras[toppingId]--
    alert("cannot take away")
  } else {
    order.item[parentId].extras[toppingId]--
  }

  window.localStorage.setItem('order', JSON.stringify(order))
}