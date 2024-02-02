// routes/productsRoutes.js
const express = require("express");
const booking_route = express();

const session = require("express-session");
const config = require("../config/config");
booking_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
booking_route.use(bodyParser.json());
booking_route.use(bodyParser.urlencoded({extended:true}));

booking_route.set('view engine','ejs');
booking_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/bookingController");

// product start from here

// List products
booking_route.get('/booking',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
booking_route.get('/booking/create',auth.isLogin, productsController.renderCreateForm);


// Display the form for editing a product
booking_route.get('/booking/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
booking_route.post('/booking/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
booking_route.get('/booking/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
booking_route.post('/booking/delete/:id',auth.isLogin, productsController.deleteProduct);

// booking_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = booking_route;
