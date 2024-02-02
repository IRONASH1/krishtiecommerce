const express = require("express");
const wish_route = express();
const session = require("express-session");

const config = require("../config/config");

wish_route.use(session({
   secret:config.sessionSecret,
   resave: false, // Set to false to avoid deprecation warning
   saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
 }));

const auth = require("../middleware/auth");

wish_route.set('view engine','ejs');
wish_route.set('views','./views');

const bodyParser = require('body-parser');
wish_route.use(bodyParser.json());
wish_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer");
const path = require("path");

wish_route.use(express.static(path.join(__dirname,'../views')));

wish_route.use(express.static('public'));

    const wishController = require("../controllers/wishController");
    
    wish_route.get('/wishlist',auth.isLogin,wishController.wish);

    wish_route.post('/addWish/:id',auth.isLogin,wishController.addWish);
    wish_route.post('/removeWish/:id',auth.isLogin,wishController.removeWish);
  
module.exports = wish_route;