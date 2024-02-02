const express = require("express");
const cart_route = express();
const session = require("express-session");

const config = require("../config/config");

cart_route.use(session({
   secret:config.sessionSecret,
   resave: false, // Set to false to avoid deprecation warning
   saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
 }));

const auth = require("../middleware/auth");

cart_route.set('view engine','ejs');
cart_route.set('views','./views');

const bodyParser = require('body-parser');
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer");
const path = require("path");

cart_route.use(express.static(path.join(__dirname,'../views')));

cart_route.use(express.static('public'));

    const cartController = require("../controllers/cartController");
    
    cart_route.get('/cart',cartController.cart);

    cart_route.post('/addCart/:id',cartController.addCart);
    cart_route.post('/removeCart/:id',cartController.removeCart);
  
module.exports = cart_route;