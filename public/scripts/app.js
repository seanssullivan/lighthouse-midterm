$(document).ready(function() {

  const checkoutListHtml = (id, item) => {
    return `
      <li id=${id}>
        <span class="checkout__list--delete"> 
          <i class="fas fa-times"></i>
        </span>
        <span class="checkout__list--name">${item.name}</span>
        <span class="checkout__list--quantity">X${item.quantity}</span>
        <span class="checkout__list--total">${parseFloat(item.price * item.quantity).toFixed(2)}</span>
      </li>
    `
  }
  
  const renderExtraHtml = (id, item) => {
    return `
      <li id=${id}>
        <span class="checkout__toppings--delete"> 
          <i class="fas fa-times"></i>
        </span>
        <span class="checkout__toppings--name">${item.name}</span>
        <span class="checkout__toppings--quantity">X${item.quantity}</span>
        <span class="checkout__toppings--total">${item.quantity * 0.99}</span>
      </li> 
    `
  }

  const handleCheckout = () => {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)

    console.log(order)
  }
  
  const refreshCheckout = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    let list = '';
    let listExtras = ''
    let total = 0;
    
    const { extras, items } = order;
    
    for (id in items) {
      const sub = items[id].price * items[id].quantity
      total = total + sub;
      list = list + checkoutListHtml(id, items[id]) 
    }

    for (extra in extras) {
      const sub = 0.99 * extras[extra].quantity
      total = total + sub;
      listExtras = listExtras + renderExtraHtml(extra, extras[extra])
    }
    total = total.toFixed(2)
    
    $('.checkout__list').empty().append(list)
    $('.checkout__toppings').empty().append(listExtras)
    $('.checkout__total--price').text(total)

    $('.checkout__toppings--delete').click(deleteTopping)
    $('.checkout__list--delete').click(deleteItem)
    $('.checkout__button').click(handleCheckout)
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
    let order = JSON.parse(storedOrder)
    const parentId = $( this ).parent().parent().parent().attr("id");
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
    } else if (order.items === undefined) {
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

  const addItemMain = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    const parentId = $( this ).parent().attr("id");
    const itemPrice = $( this ).parent().children().first().next().children().last().text()
    const itemName = $( this ).parent().children().first().next().children().first().text()
    

    if (order === null) {
      order = {}
      order.items = {
        [parentId]: {
          quantity: 0,
          price: itemPrice,
          name: itemName
        }
      }
    } else if (order.items === undefined) {
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
    const toppingId = $( this ).parent().attr("id")
    const toppingName = $( this ).parent().children().first().text();
    let order = JSON.parse(storedOrder)

    if (order === null) {
      order = {}
      order.extras = {}
    } else if (order.extras === undefined) {
      order.extras = {}
    }
    
    if (order.extras[toppingId] === undefined) {
      order.extras[toppingId] = {
        name: toppingName,
        quantity: 1
      }
    } else {
      order.extras[toppingId].quantity++
    }
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }
  
  const removeTopping = function() {
    const storedOrder = window.localStorage.getItem('order')
    const parentId = $( this ).parent().parent().parent().parent().attr("id")
    const toppingId = $( this ).parent().attr("id")
    let order = JSON.parse(storedOrder)
    
    if (order.extras[toppingId].quantity === 0) {
      // order.item[parentId].extras[toppingId]--
      alert("cannot take away")
    } else {
      order.extras[toppingId].quantity--
    }
  
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }

  const deleteTopping = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    const id = $( this ).parent().attr("id")
    delete order.extras[id]
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }

  const deleteItem = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    const id = $( this ).parent().attr("id")
    delete order.items[id]
    window.localStorage.setItem('order', JSON.stringify(order))
    refreshCheckout()
  }

  const checkoutInfo = function() {
    window.location.href = '/order'
  }

  const goBack = function() {
    window.location.href = '/menu'
  }

  const setIntervalLoop = () => {
    const intervalId = setInterval(()=> {
      const orderId = 1;
      $.get(`/admin/confirmation/${orderId}`)
        .then(data => {
          if (data.pickUpTime) {
            const pickUpTime = new Date(data.pickUpTime);
            const minutes = Math.round((pickUpTime.getTime() - Date.now()) / 1000 / 60);
            $('.checkoutInfo__pending').addClass('hide');
            $('.checkoutInfo__confirmed').removeClass('hide');
            // $('#pickUpTime').text(`${minutes}`);
            // $('#pending-bell').hide();
            // $('#confirmed-bell').show();

            clearInterval(intervalId);
          }
        });
    }, 5000);
  }

  const submitPending = function(data) {
    console.log('puppies')
    $('.checkoutInfo__text').addClass('hide')
    $('.checkoutInfo__pending').removeClass('hide')

    setIntervalLoop()
  }

  const submitError = function(error) {
    console.log(error)
  }

  const submitInfo = function() {
    const storedOrder = window.localStorage.getItem('order')
    let order = JSON.parse(storedOrder)
    const { extras, items } = order;
    const name = $( this ).siblings().last().children().first().children().last().val()
    const email = $( this ).siblings().last().children().first().next().children().last().val()
    const phone = $( this ).siblings().last().children().first().next().next().children().last().val()
    
    const itemArray = []
    const extrasArray = []

    for (id in items) {
      const obj = {}
      obj.id = id;
      obj.quantity = items[id].quantity
      itemArray.push(obj)
    }

    for (id in extras) {
      const obj = {};
      obj.id = id;
      obj.quantity = extras[id].quantity
      extrasArray.push(obj)
    }

    const formData = {
      name,
      email,
      phone,
      items: itemArray,
      extras: extrasArray
    }

    $.ajax({
      type: "POST",
      url: '/api/orders/add',
      data: formData,
      success: submitPending,
      error: submitError
    })
  }

  const adminPending = function() {
    window.location.href = '/admin/pending'
  }

  const adminProgress = function() {
    window.location.href = '/admin/progress'
  }

  const adminReady = function() {
    window.location.href = '/admin/ready'
  }

  const adminCompleted = function() {
    window.location.href = '/admin/completed'
  }

  const reloadPage = function() {
    window.location.reload()
  }

  const submitToPending = function() {
    const id = $( this ).parent().children().first().text().split(' ')[1]
    $.ajax({
      type: 'POST',
      url: `../api/orders/${id}/confirm`,
      data: {mins: 10},
      success: reloadPage,
      error: submitError
    })
  }


  // ~~ Client Click events
  
  $('.itemInfo__topping--add').click(addTopping)
  $('.itemInfo__topping--minus').click(removeTopping)
  $('.itemInfo__add').children().last().click(addItem)
  $('.itemInfo__back').click(goBack)
  
  $('.menuItem__button--add').click(addItemMain)
  $('.menuItem__button--info').click(renderMenuItem);

  $('.checkout__button').click(checkoutInfo)
  $('.checkoutInfo__submit').click(submitInfo)
  
  refreshCheckout()
  
  // ~~ Admin Click Events
  $('.adminNav__pending').click(adminPending)
  $('.adminNav__progress').click(adminProgress)
  $('.adminNav__ready').click(adminReady)
  $('.adminNav__completed').click(adminCompleted)
  // $('ordersList__item').click(selectItem)
  $('.orderInfo__button').click(submitToPending)
})

// const setIntervalLoop = () => {
//   const intervalId = setInterval(()=> {
//     const orderId = $('#orderId').text();
//     $.get(`/confirmation/${orderId}`)
//       .then(data => {
//         if (data.pickUpTime) {
//           const pickUpTime = new Date(data.pickUpTime);
//           const minutes = Math.round((pickUpTime.getTime() - Date.now()) / 1000 / 60);
//           $('#pending-block').hide();
//           $('#confirmed-block').show();
//           $('#pickUpTime').text(`${minutes}`);
//           $('#pending-bell').hide();
//           $('#confirmed-bell').show();

//           clearInterval(intervalId);
//         }
//       });
//   }, 5000);
// }

// $(document).ready(setIntervalLoop());