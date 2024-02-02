// routes/productsRoutes.js
const express = require("express");
const homeProduct_route = express();

const session = require("express-session");
const config = require("../config/config");
homeProduct_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
homeProduct_route.use(bodyParser.json());
homeProduct_route.use(bodyParser.urlencoded({extended:true}));

homeProduct_route.set('view engine','ejs');
homeProduct_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/productsController");

// product start from here

// List products
homeProduct_route.get('/homeProduct',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
homeProduct_route.get('/homeProduct/create',auth.isLogin, productsController.renderCreateForm);

// Create a new product
homeProduct_route.post('/homeProduct/create',auth.isLogin, productsController.createProduct);

// Display the form for editing a product
homeProduct_route.get('/homeProduct/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
homeProduct_route.post('/homeProduct/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
homeProduct_route.get('/homeProduct/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
homeProduct_route.post('/homeProduct/delete/:id',auth.isLogin, productsController.deleteProduct);

// homeProduct_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = homeProduct_route;
