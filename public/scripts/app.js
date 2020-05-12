$(document).ready(function() {

  const checkoutListHtml = item => {
    return `
      <li>
        <span class="checkout__list--toggle"> 
          <i class="fas fa-caret-down"></i>
        </span>
        <span class="checkout__list--item">${item.name}</span>
        <span class="checkout__list--total">${parseFloat(item.price * item.quantity).toFixed(2)}</span>
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
      <span>${item.name}</span>
        <span>X${item.quantity}</span>
        <span>
          <i class="fas fa-plus"></i>
        </span>
      <span>
        <i class="fas fa-minus"></i>
      </span>
      <span class="checkout__info--toppingTotal">${item.quantity * 0.99}</span>
    </div> 
    `
  }
  
  const refreshCheckout = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    let list = '';
    let listExtras = ''
    const { items } = order;
    
    for (id in items) {
      list = list + checkoutListHtml(items[id])

      if (items[id].extras) {
        
        for (extra in items[id].extras) {
          // console.log(extra)
          listExtras = listExtras + renderExtraHtml(items[id].extras[extra])
        }
      }
    }
    
    $('.checkout__list').empty().append(list)
    $('.checkout__info--toppings').empty().append(listExtras)
  }
  
  const renderMenuItem = function(e) {
    window.location.href = `/menu/${$( this ).parent().attr("id")}`
    refreshCheckout()
  }
  
  const getCookie = () => {
    const order = Cookies.get('order') // => 'value'
  }
  
  const setCookie = (order) => {
    Cookies.set('order', order)
  
  }
  
  const addItem = function() {
    const storedOrder = window.localStorage.getItem('order')
    const parentId = $( this ).parent().parent().parent().attr("id");
    let order = JSON.parse(storedOrder)
    const itemPrice = $( this ).parent().children().first().children().last().text()
    const itemName = $( this ).parent().parent().children().first().text()
  
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
    const toppingName = $( this ).parent().children().first().text();
    let order = JSON.parse(storedOrder)
    
    // console.log(order)
    if (order === null || order.extras === null) {
      order = {}
      order.extras = {}
    }
  
    if (order.items[parentId].extras[toppingId] === undefined) {
      console.log(order.items[parentId].extras)
      order.items[parentId].extras = {
        [toppingId]: {
          quantity: 1,
          name: toppingName
        }
      }
    } else {
      console.log('2')
      order.items[parentId].extras[toppingId].quantity++
    }
  
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }
  
  const removeTopping = function() {
    const storedOrder = window.localStorage.getItem('order')
    const parentId = $( this ).parent().parent().parent().parent().attr("id")
    const toppingId = $( this ).parent().attr("id")
    let order;
    if (storedOrder) {
      order = JSON.parse(storedOrder)
    } else {
      // order = {}
      // order.items = {
      //   [id]: {
      //     extras: {}
      //   }
      // }
    }
    
    if (order.items[parentId].extras[toppingId] === 0) {
      // order.item[parentId].extras[toppingId]--
      alert("cannot take away")
    } else {
      order.items[parentId].extras[toppingId].quantity--
    }
  
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }

  // ~~ Client Click events
  $('.itemInfo__topping--add').click(addTopping)
  $('.itemInfo__topping--minus').click(removeTopping)
  $('.itemInfo__add').children().last().click(addItem)

  $('.menuItem__button--info').click(renderMenuItem);

  // ~~ Admin Click Events
  // $('.')

  refreshCheckout()
})

