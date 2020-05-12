$(document).ready(function() {

  // ~~ Client Click events
  $('.itemInfo__topping--add').click(addTopping)
  $('.itemInfo__topping--minus').click(removeTopping)
  $('.itemInfo__add').children().last().click(addItem)

  $('.menuItem__button--info').click(renderMenuItem);

  // ~~ Admin Click Events
  // $('.')
})

const checkoutListHtml = item => {
  return `
    <li>
      <span class="checkout__list--toggle"> 
        <i class="fas fa-caret-down"></i>
      </span>
      <span class="checkout__list--item">${item.name}</span>
      <span class="checkout__list--total">${item.price * item.quantity}</span>
      <div class="checkout__info">
          <div class="checkout__info--quantity">
            <span>QUANTITY</span>
            <span>X${item.quantity}</span>
            <span>
              <i class="fas fa-plus"></i>
            </span>
            <span>
              <i class="fas fa-minus"></i>
            </span>
            <span class="checkout__info--quantityTotal">${item.price}</span>
          </div>
          <div class="checkout__info--toppings">
          </div>
      </div>
    </li>
  `
}

const renderExtraHtml = item => {
  return `
  <div class="checkout__info--topping">
    <span>TOPPPING 1</span>
      <span>X1</span>
      <span>
        <i class="fas fa-plus"></i>
      </span>
    <span>
      <i class="fas fa-minus"></i>
    </span>
    <span class="checkout__info--toppingTotal">0.99</span>
  </div> 
  `
}

{/* */}

const refreshCheckout = function() {
  const storedOrder = window.localStorage.getItem('order')
  let order = JSON.parse(storedOrder)
  let list = '';
  const { items } = order;
  console.log(items)
  for (id in items) {
    console.log(id)
    list = list + checkoutListHtml(items[id])
    console.log(list)
  }
  
  $('.checkout__list').empty().append(list)
}

const renderMenuItem = function(e) {
  window.location.href = `/menu/${$( this ).parent().attr("id")}`
  refreshCheckout()
}

const addItem = function() {
  const storedOrder = window.localStorage.getItem('order')
  const parentId = $( this ).parent().parent().parent().attr("id");
  let order = JSON.parse(storedOrder)
  const itemPrice = $( this ).parent().children().first().children().last().text()
  const itemName = $( this ).parent().parent().children().first().text()
  console.log(order.items)
  if (order === null) {
    order = {}
    order.items = {
      [parentId]: {
        quantity: 0,
        price: itemPrice,
        name: itemName
      }
    }
  } else if (order.items[parentId] === undefined) {
    order.items[parentId] = {
      quantity: 0,
      price: itemPrice,
      name: itemName
    }
  } else if (order.items[parentId].quantity === null) {
    order.items = {
      [parentId]: {
        quantity: 0,
        price: itemPrice,
        name: itemName
      }
    }
  }

  order.items[parentId].quantity++
  
  window.localStorage.setItem('order', JSON.stringify(order))

  refreshCheckout()
}

const addTopping = function() {
  const storedOrder = window.localStorage.getItem('order')
  const parentId = $( this ).parent().parent().parent().parent().attr("id")
  const toppingId = $( this ).parent().attr("id")
  let order = JSON.parse(storedOrder)
  if (order === null) {
    order = {}
    order.items = {
      [parentId]: {
        extras: {}
      }
    }
  } else if (order.items[parentId].extras === undefined) {
    order.items[parentId].extras= {}
  }

  if (order.items[parentId].extras[toppingId] === undefined) {
    order.items[parentId].extras[toppingId] = 1
  } else {
    order.items[parentId].extras[toppingId]++
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
    order.items = {
      [id]: {
        extras: {}
      }
    }
  }
  
  if (order.items[parentId].extras[toppingId] === 0) {
    // order.item[parentId].extras[toppingId]--
    alert("cannot take away")
  } else {
    order.items[parentId].extras[toppingId]--
  }

  window.localStorage.setItem('order', JSON.stringify(order))
}