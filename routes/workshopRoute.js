// routes/productsRoutes.js
const express = require("express");
const workshopProduct_route = express();

const session = require("express-session");
const config = require("../config/config");
workshopProduct_route.use(session({
    secret:config.sessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
  }));

const bodyParser = require("body-parser");
workshopProduct_route.use(bodyParser.json());
workshopProduct_route.use(bodyParser.urlencoded({extended:true}));

workshopProduct_route.set('view engine','ejs');
workshopProduct_route.set('views','./views');

const auth = require("../middleware/adminAuth");
const productsController = require("../controllers/workshopController");

// product start from here

// List products
workshopProduct_route.get('/workshopProduct',auth.isLogin, productsController.listProducts);

// Display the form for creating a new product
workshopProduct_route.get('/workshopProduct/create',auth.isLogin, productsController.renderCreateForm);

// Create a new product
workshopProduct_route.post('/workshopProduct/create',auth.isLogin, productsController.createProduct);

// Display the form for editing a product
workshopProduct_route.get('/workshopProduct/edit/:id',auth.isLogin, productsController.renderEditForm);

// Update a product
workshopProduct_route.post('/workshopProduct/edit/:id',auth.isLogin, productsController.editProduct);

// Display a confirmation page for deleting a product
workshopProduct_route.get('/workshopProduct/delete/:id',auth.isLogin, productsController.renderDeleteForm);

// Delete a product
workshopProduct_route.post('/workshopProduct/delete/:id',auth.isLogin, productsController.deleteProduct);

// workshopProduct_route.get('*',function(req,res){
 
//     res.redirect('/admin');

// })


module.exports = workshopProduct_route;
