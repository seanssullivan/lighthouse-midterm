// server.js

// ????????????????????????????????????????????????????????????????
// ????????????????????????? Restful Stack App ????????????????????????????
// ????????????????????????????????????????????????????????????????

// ?? A Food Pick-up Ordering App
// ?? 
// ?? Developed by Sean Sullivan and Heisey
// ?? Created on May 01, 2020
// ?? Published on __
// ?? run npm start to run server
// ?? uses nodemon as a dev dependency
// ??
// ?? Using Better Comments for color coding
// ?? The following is the color key for app commenting
// ??  Key   Meaning   Hex 
//     ??    Titles    (#24c5ff)
//     ~~    Notes     (#ff9900)
//     ^^    Requests  (#ff69b4)
//     !!    Errors    (#ff0011)
//     ##    DataBase  (#78f022)
//     **    Security  (#9822f2)
//     $$    WARNING   (#fff700)

// ???????????????????????? File Modules ??????????????????????????
// ?? Database Connection
const db = require('./db');

// ?? Routes
const menuRoutes = require("./routes/menu");
const ordersRoutes = require("./routes/orders");

// ?? Middleware
const morgan = require('./middleware/morganCustom');
const { visitors } = require('./middleware/visitors');

// ???????????????????????? Node Modules ??????????????????????????
const path = require('path');

// ??????????????????????? Vendor Modules ?????????????????????????
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const chalk = require('chalk')
const express = require("express");
const helmet = require("helmet");
const cookieSession = require('cookie-session');

// ????????????????????????????????????????????????????????????????
// ???????????????????????? Application ???????????????????????????
// ????????????????????????????????????????????????????????????????

// ~~ Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

// ~~ Initialize app
const app = express();

// ~~ Start morgan
app.use(morgan);

// ~~ Set Helmet
app.use(helmet())

// ~~ Set up template engine
app.set("view engine", "pug");

// ~~ Include method override
app.use(methodOverride('_method'));

// ~~ Import public dir
app.use(express.static(path.join(__dirname, '/public')));

// ~~ Parse body
app.use(bodyParser.urlencoded({ extended: true }));

// ~~ Cookie Sessions
app.use(cookieSession({
  name: 'session',
  keys: ["testkey1", "testkey2", "testkey3"]
}));

// ~~ Setup sass task runner
// app.use("/styles", sass({
//   src: __dirname + "/styles",
//   dest: __dirname + "/public/styles",
//   debug: true,
//   outputStyle: 'expanded'
// }));

// ~~ Custom Middleware
app.use(visitors(db));

// ~~ Set request time to request obj
app.use((req, res, next) => {

  // ~~ Get Date
  let requestTime = new Date();

  // ~~ Set Date and app name to req obj
  req.requestTime = requestTime.toISOString;

  // ~~ Set App name for logging
  req.appName = 'RESTFULL STACK APP';

  // ~~ Log Data to console
  console.log(chalk.magenta.bold.inverse(`Request Time: ${requestTime}`));

  next();
})

// ?????????????????????????? Routes ??????????????????????????????
app.use("/api/menu", menuRoutes(db));
app.use("/api/orders", ordersRoutes(db));

// ~~ Landing Page
app.get("/", (req, res, next) => {
  res.render("landing");
});

app.get("/menu", async (req, res, next) => {
  try {
    const menuItems = await db.menuItems.all();
    
    res.render("menu", {
      data: {
        menu: menuItems
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get("/menu/:id", async (req, res, next) => {
  try {
    const visitorId = req.session.user_id;
    const itemId = req.params.id;
    const menuItem = await db.menuItems.get(visitorId, itemId);
    const extras = await db.extras.get();
    
    res.render("itemInfo", {
      data: {
        menu: menuItem[0],
        extras
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get("/order", (req, res, next) => {
  res.render("checkoutInfo")
})

app.post("/submit", (req, res, next) => {
  const {name, email, phone, items, extras} = req.body


  db.orders.add(req.body)

  res.status(201).send()
})

app.get("/thankyou", (req, res, next) => {
  res.render("thankyou")
})

app.get("/admin/pending", async (req, res, next) => {
  try {
    const ordersPending = await db.orders.getPending({offset: 1, limit: 10})
    
    // console.log("orders",ordersPending)
    res.render("admin", {
      data: {
        show: 'pending',
        orders: ordersPending,
        firstOrder: ordersPending[0]
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get("/admin/progress", async (req, res, next) => {
  try {
    const ordersPending = await db.orders.getConfirmed({offset: 1, limit: 10})
    
    
    console.log("orders",ordersPending)
    res.render("admin", {
      data: {
        show: 'progress',
        orders: ordersPending
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get("/admin/ready", async (req, res, next) => {
  try {
    const ordersPending = await db.orders.getReady({offset: 1, limit: 10})
    
    
    console.log("orders",ordersPending)
    res.render("admin", {
      data: {
        show: 'ready',
        orders: ordersPending
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get("/admin/completed", async (req, res, next) => {
  try {
    const ordersComplete = await db.orders.getCompleted({offset: 0, limit: 10})
    const firstOrder = ordersComplete[0]
    
    res.render("admin", {
      data: {
        orders: ordersComplete,
        firstOrder,
        show: 'completed',
        page: 1
      }
    })
  } catch(err) {
    console.log(err)
  }
  
})

app.get('/admin/confirmation/:id', (req, res, next) => {
  console.log('hello')
  res.status(200).json({
    data: {
      pickupTime: "2020/03/25 13:24:23.34323"

    }
  })
})


// ~~ Catch all routes
app.get("*", (req, res, next) => {
  res.status(404).send('sorry you got lost')
})

// ~~ Connect App
app.listen(PORT, () => {
  console.log(chalk.blue.bold.inverse(`<<<<< App is listening on ${PORT} >>>>>`));
});
