// routes/productsRoutes.js
const express = require("express");
const customizationProduct_route = express();

const session = require("express-session");
const config = require("../config/config");
customizationProduct_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
customizationProduct_route.use(bodyParser.json());
customizationProduct_route.use(bodyParser.urlencoded({extended:true}));

customizationProduct_route.set('view engine','ejs');
customizationProduct_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/customizationController");

// product start from here

// List products
customizationProduct_route.get('/customizationProduct',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
customizationProduct_route.get('/customizationProduct/create',auth.isLogin, productsController.renderCreateForm);

// Create a new product
customizationProduct_route.post('/customizationProduct/create',auth.isLogin, productsController.createProduct);

// Display the form for editing a product
customizationProduct_route.get('/customizationProduct/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
customizationProduct_route.post('/customizationProduct/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
customizationProduct_route.get('/customizationProduct/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
customizationProduct_route.post('/customizationProduct/delete/:id',auth.isLogin, productsController.deleteProduct);

// customizationProduct_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = customizationProduct_route;
