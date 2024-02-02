// routes/productsRoutes.js
const express = require("express");
const galleryProduct_route = express();

const session = require("express-session");
const config = require("../config/config");
galleryProduct_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
galleryProduct_route.use(bodyParser.json());
galleryProduct_route.use(bodyParser.urlencoded({extended:true}));

galleryProduct_route.set('view engine','ejs');
galleryProduct_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/galleryController");

// product start from here

// List products
galleryProduct_route.get('/galleryProduct',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
galleryProduct_route.get('/galleryProduct/create',auth.isLogin, productsController.renderCreateForm);

// Create a new product
galleryProduct_route.post('/galleryProduct/create',auth.isLogin, productsController.createProduct);

// Display the form for editing a product
galleryProduct_route.get('/galleryProduct/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
galleryProduct_route.post('/galleryProduct/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
galleryProduct_route.get('/galleryProduct/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
galleryProduct_route.post('/galleryProduct/delete/:id',auth.isLogin, productsController.deleteProduct);

// galleryProduct_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = galleryProduct_route;
