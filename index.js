require("dotenv").config();
// Connect to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("Mongodb Connected"));
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload'); // Import express-fileupload
const app = express();

// Set up EJS as the view engine

//  telling here that what view engine we are using to perform task for 404 
app.set('view engine','ejs');

// this routes file is only for user so we specifify the path in users folder here for 404
app.set('views','./views');

// Use body-parser for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for parsing form data and file uploads
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Set up static file serving for assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));  
// app.use(express.static('public'));

// for home
// const homeRoute = require('./routes/homeRoute');
// app.use('/',homeRoute);

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

//for homeProduct routes
const homeProductRoute = require('./routes/productsRoute');
app.use('/admin',homeProductRoute);

//for paintingProduct routes
const paintingProductRoute = require('./routes/paintingsRoute');
app.use('/admin',paintingProductRoute);

//for galleryProduct routes
const galleryProductRoute = require('./routes/galleryRoute');
app.use('/admin',galleryProductRoute);

//for customizationProduct routes
const customizationProductRoute = require('./routes/customizationRoute');
app.use('/admin',customizationProductRoute);

//for workshopProduct routes
const workshopProductRoute = require('./routes/workshopRoute');
app.use('/admin',workshopProductRoute);

//for booking routes
const bookingProductRoute = require('./routes/bookingRoute');
app.use('/admin',bookingProductRoute);

// for addcart routes
const cartRoute = require('./routes/cartRoute');
app.use('/',cartRoute);

// for wish routes
const wishRoute = require('./routes/wishRoute');
app.use('/',wishRoute);


  //for not available link or page
app.use((req, res, next) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
