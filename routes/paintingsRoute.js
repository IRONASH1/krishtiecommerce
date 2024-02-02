// routes/productsRoutes.js
const express = require("express");
const paintingProduct_route = express();

const session = require("express-session");
const config = require("../config/config");
paintingProduct_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
paintingProduct_route.use(bodyParser.json());
paintingProduct_route.use(bodyParser.urlencoded({extended:true}));

paintingProduct_route.set('view engine','ejs');
paintingProduct_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/paintingsController");

// product start from here

// List products
paintingProduct_route.get('/paintingProduct',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
paintingProduct_route.get('/paintingProduct/create',auth.isLogin, productsController.renderCreateForm);

// Create a new product
paintingProduct_route.post('/paintingProduct/create',auth.isLogin, productsController.createProduct);


// Display the form for editing a product
paintingProduct_route.get('/paintingProduct/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
paintingProduct_route.post('/paintingProduct/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
paintingProduct_route.get('/paintingProduct/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
paintingProduct_route.post('/paintingProduct/delete/:id',auth.isLogin, productsController.deleteProduct);

// paintingProduct_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = paintingProduct_route;
