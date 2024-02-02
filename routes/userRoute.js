const express = require("express");
const user_route = express();
const session = require("express-session");
const User = require('../models/userModel');

const config = require("../config/config");
const { v4: uuidv4 } = require('uuid');
user_route.use(session({
   secret:config.sessionSecret,
   resave: false, // Set to false to avoid deprecation warning
   saveUninitialized: true, // Set to true if you want to save sessions that are new but not modified
 }));

 user_route.use(async (req, res, next) => {
  if (!req.session.uniqueID) {
    // Generate a unique ID
    const uniqueID = uuidv4();
    req.session.uniqueID = uniqueID;

    // Check if a user with this uniqueID already exists in the database
    const existingUser = await User.findOne({ uniqueID });

    // If the user does not exist, save it to the database
    if (!existingUser) {
      const newUser = new User({ uniqueID });
      await newUser.save();
    }
  }

  next();
});


// user_route.use(async (req, res, next) => {
//   if (!req.session.uniqueID) {
//       // Generate a unique ID
//       const uniqueID = uuidv4();
//       req.session.uniqueID = uniqueID;

//       // Save it to the database
//       const newUser = new User({ uniqueID });
//       await newUser.save();
//   }

//   next();
// });


const auth = require("../middleware/auth");

user_route.set('view engine','ejs');
user_route.set('views','./views');

// Set up flash middleware
user_route.use(require('express-flash')());

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer");
const path = require("path");

user_route.use(express.static(path.join(__dirname,'../views')));

user_route.use(express.static('public'));


const userController = require("../controllers/userController");

user_route.get('/',userController.webLoad);

user_route.get('/painting',userController.paintingLoad);

user_route.get('/gallery',userController.galleryLoad);

user_route.get('/customization',userController.customizationLoad);

user_route.get('/workshop',userController.workshopLoad);

user_route.get('/about',userController.aboutLoad);

user_route.get('/contact',userController.contactLoad);

user_route.get('/account',auth.isLogin,userController.accountLoad);

user_route.get('/home',auth.isLogin,userController.userHomeLoad);

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',userController.insertUser);

user_route.post('/verify',userController.verifyMail);

user_route.post('/resend-otp',userController.resendVerifyMail);

user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.forgetVerify);

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);

user_route.post('/forget-password',userController.resetPassword);

user_route.get('/verification',userController.verificationLoad);

user_route.post('/verification',userController.sentVerificationLink);

user_route.get('/edit',auth.isLogin,userController.editLoad);

user_route.post('/edit',userController.updateProfile);



// Display the form for editing a product
user_route.get('/editScheduled/:id', userController.renderscheduledEditForm);

// Update a product
user_route.post('/editScheduled/:id',auth.isLogin, userController.editscheduled);

// Display the form for editing a product
user_route.get('/deleteScheduled/:id',auth.isLogin, userController.renderscheduledDeleteForm);

// Update a product
user_route.post('/deleteScheduled/:id',auth.isLogin, userController.deletescheduled);

// Define a route to display an individual product page
user_route.get('/product/:id',userController.Productpage );

// Define a route to display an individual product book form
user_route.get('/bookClass/:id',auth.isLogin,userController.bookClassPage );

user_route.post('/confirm-booking',auth.isLogin,userController.confirmBooking );

module.exports = user_route;