const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Product = require('../models/productModel');
const paintingProduct = require('../models/paintingProductModel');
const galleryProduct = require('../models/galleryProductModel');
const customizationProduct = require('../models/customizationProductModel');
const workshopProduct = require('../models/workshopProductModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const config = require("../config/config");

const randormstring = require("randomstring");
const express = require('express');
const app = express();
const path = require("path");

// to ignore ssl certificate used below code only for development area
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(express.static('public'));


const Productpage = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user_id);
        const products = await paintingProduct.find().sort({ created_at: -1 });
        const productId = req.params.id;
        const product1 = await Product.findById(productId);
        const product2 = await paintingProduct.findById(productId);
        const product3 = await galleryProduct.findById(productId);
        const product4 = await customizationProduct.findById(productId);
        const product5 = await workshopProduct.findById(productId);
        
        if (!userData) {
            if (product1) {
                res.render('product-detail', { user: '', product: product1,products });
            } else if (product2) {
                res.render('product-detail', { user: '', product: product2,products });
            } else if (product3) {
                res.render('product-detail', { user: '', product: product3,products });
            } else if (product4) {
                res.render('product-detail', { user: '', product: product4,products });
            } else if (product5) {
                res.render('product-detail', { user: '', product: product5,products });
            } else {
                res.render('product-detail', { user: '', product: null,products }); // No product found
            }
        } 
        
        else {
            if (product1) {
                res.render('product-detail', { user: userData, product: product1,products });
            } else if (product2) {
                res.render('product-detail', { user: userData, product: product2,products });
            } else if (product3) {
                res.render('product-detail', { user: userData, product: product3,products });
            } else if (product4) {
                res.render('product-detail', { user: userData, product: product4,products });
            } else if (product5) {
                res.render('product-detail', { user: userData, product: product5,products });
            } else {
                res.render('product-detail', { user: userData, product: null,products }); // No product found
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

const bookClassPage = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user_id);
        const products = await paintingProduct.find().sort({ created_at: -1 });
        const productId = req.params.id;
        const product5 = await workshopProduct.findById(productId);
        
        if (!userData) {
            if (product5) {
                res.render('classBook', { user: '', product: product5,products });
            } else {
                res.render('classBook', { user: '', product: null,products }); // No product found
            }
        } 
        
        else {
           if (product5) {
                res.render('classBook', { user: userData, product: product5,products });
            } else {
                res.render('classBook', { user: userData, product: null,products }); // No product found
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

const webLoad = async(req,res)=>{
    try {
        const user = "";
        // const products = await Product.find();
        const products = await Product.find().sort({ created_at: -1 }); // Sort in descending order
        // res.render('home',{ user });
        res.render('home', { user: user, products: products });

    } catch (error) {
        console.log(error.message);
    }

}

const paintingLoad = async(req,res)=>{
  
    try {
       
        const userData = await User.findById(req.session.user_id);
        const products = await paintingProduct.find().sort({ created_at: -1 }); // Sort in descending order
        if (!userData) {
          res.render('painting', { user: '',products:products }); // Pass user as ''
        }
        else if(!products){
            res.render('painting', { user: userData,products: '' }); // Pass user as ''
        }
         else {
          res.render('painting', { user: userData,products:products }); // Pass user data if available
        }
        
    } catch (error) {
        console.log(error.message);
    }

}

const galleryLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);
        const products = await galleryProduct.find().sort({ created_at: -1 }); // Sort in descending order
        if (!userData) {
            res.render('gallery', { user: '',products:products }); // Pass user as ''
          }
          else if(!products){
              res.render('gallery', { user: userData,products: '' }); // Pass user as ''
          }
           else {
            res.render('gallery', { user: userData,products:products }); // Pass user data if available
          }
        

    } catch (error) {
        console.log(error.message);
    }

}

const customizationLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);
        const products = await customizationProduct.find().sort({ created_at: -1 }); // Sort in descending order
        if (!userData) {
            res.render('customization', { user: '',products:products }); // Pass user as ''
          }
          else if(!products){
              res.render('customization', { user: userData,products: '' }); // Pass user as ''
          }
           else {
            res.render('customization', { user: userData,products:products }); // Pass user data if available
          }

    } catch (error) {
        console.log(error.message);
    }

}

const workshopLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);
      
        const products = await workshopProduct.find().sort({ created_at: -1 });

     if (userData) {
  const userEmail = userData.email;

  // Find bookings for the user
  const bookings = await Booking.find({ email: userEmail });
//   console.log('bookings'+bookings)

  if (bookings.length > 0) {
    // Extract workshop names from the result
    const workshopNames = bookings.map(booking => booking.workshop);

    // Use the workshop names in a query to find data from workshopProduct model
    const workshopData = await workshopProduct.find({ userData,workshop: { $in: workshopNames } });
    console.log('workshopData'+workshopData)
    // Render the 'workshop.ejs' template with user-specific data
    res.render('workshop', {user: userData, workshopData, products, bookings });
  } else {
    // Render the 'workshop.ejs' template with user-specific data
    res.render('workshop', { workshopData: [], products, bookings,user: userData });
  }
} else {
  // User is not logged in
  // Render the 'workshop.ejs' template with workshopProduct model data
  res.render('workshop', { workshopData: products, products, bookings: [] ,user: ''});
}

    } catch (error) {
        console.log(error.message);
    }

}

const aboutLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);

        if (!userData) {
          res.render('about', { user: '' }); // Pass user as ''
        } else {
          res.render('about', { user: userData }); // Pass user data if available
        }
        

    } catch (error) {
        console.log(error.message);
    }

}

const contactLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);

        if (!userData) {
          res.render('contact', { user: '' }); // Pass user as ''
        } else {
          res.render('contact', { user: userData }); // Pass user data if available
        }
        

    } catch (error) {
        console.log(error.message);
    }

}

const wishlistLoad = async(req,res)=>{

    try {
       
        const userData = await User.findById(req.session.user_id);

        if (!userData) {
          res.render('wishlist', { user: '' }); // Pass user as ''
        } else {
          res.render('wishlist', { user: userData }); // Pass user data if available
        }
        

    } catch (error) {
        console.log(error.message);
    }

}

const accountLoad = async(req,res)=>{

    try {
        const userData = await User.findById({ _id:req.session.user_id });
        const userEmail = userData.email;
        console.log('userEmail'+userEmail)
        const products = await Booking.find({ email: userEmail }).sort({ created_at: -1 });
        res.render('account',{ user:userData,products });
    } catch (error) {
        console.log(error.message);
    }

}

const userHomeLoad = async(req,res)=>{
    try {
        const products = await Product.find().sort({ created_at: -1 }); // Sort in descending order
        const userData = await User.findById({ _id:req.session.user_id });
        res.render('home',{ user:userData,products: products });

    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async(password)=>{

    try {
        
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }

}

//for send mail
const sendVerifyMail = async(name, email, user_id)=>{

    try {

        function generateRandomOTP(length) {
            const characters = '0123456789';
            let OTP = '';
        
            for (let i = 0; i < length; i++) {
                const index = Math.floor(Math.random() * characters.length);
                OTP += characters[index];
            }
        
            return OTP;
        }
        const otpLength = 6; // Specify the length of the OTP
        const otp = generateRandomOTP(otpLength); // Generate a random OTP
        const otpExpiryTime = new Date(new Date().getTime() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Save the OTP and its expiration time in the user model
        await User.findByIdAndUpdate(user_id, {
            verificationCode: otp,
            verificationCodeExpiry: otpExpiryTime,
        });
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'From Krishti Art Account Verification',
            html: `<p>Hii ${name}, please use this OTP to verify your email: ${otp}</p>`,
            // html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}

const sendagainVerifyMail = async(name, email, user_id)=>{

    try {
        function generateRandomOTP(length) {
            const characters = '0123456789';
            let OTP = '';
        
            for (let i = 0; i < length; i++) {
                const index = Math.floor(Math.random() * characters.length);
                OTP += characters[index];
            }
        
            return OTP;
        }
        const otpLength = 6; // Specify the length of the OTP
        const otp = generateRandomOTP(otpLength); // Generate a random OTP
        const otpExpiryTime = new Date(new Date().getTime() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Save the OTP and its expiration time in the user model
        await User.findByIdAndUpdate(user_id, {
            verificationCode: otp,
            verificationCodeExpiry: otpExpiryTime,
        });
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'From Krishti Art Account Verification',
            html: `<p>Hii ${name}, Here is your OTP please use this OTP to verify your email: ${otp}</p>`,
            // html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}

//for reset password send mail
const sendResetPasswordMail = async(name, email, token)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For Reset Password',
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/forget-password?token='+token+'"> Reset </a> your password.</p>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }

}

const loadRegister = async(req,res)=>{
    try {
        
        res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
}





const verifyMail = async(req, res)=>{

    try {
        
        const { email, otp } = req.body;
       

        // Fetch user by email
        const user = await User.findOne({ email });
        console.log('user'+user)
    
        // Check if the entered OTP matches
        if (user && user.verificationCode === otp) {
          // Mark the user as verified (you can also update other fields)
          user.is_verified = 1;
          await user.save();
    
          // Redirect or respond as needed
          return res.render('login', { message1: 'OTP Verification Sucessfully Done' });
        } else {
          return res.render('registration', { message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error.message);
    }

}

const resendVerifyMail = async(req,res)=>{
    try{
         // Assuming you have a user_id stored in the session
         const { email} = req.body;
         console.log(' email, otp'+ email)
    const user_id = await User.findOne({ email });

    if (user_id) {
         // Send the new OTP to the user's email
    const user = await User.findById(user_id);
    await sendagainVerifyMail(user.name, user.email, user_id);
        res.render('registration', {
            message: "OTP resend Sucessfully. Please Check Your Mail",
        });
    } 
    else {
        res.render('registration', { message: "Resend OTP fail." });
    }
    }
    
    catch (error) {
        console.log(error.message);
    }

}


// login user methods started

const loginLoad = async(req,res)=>{

    try {
        
        res.render('login');

    } catch (error) {
        console.log(error.message);
    }

}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail." });
                } else {
                    // Set isLoggedIn to true
                    userData.isLoggedIn = true;
                    await userData.save();

                    req.session.user_id = userData._id;
                    console.log("User logged in:", userData._id);
                    res.redirect('/home');
                }
            } else {
                res.render('login', { message: "Email and password are incorrect" });
            }
        } else {
            res.render('login', { message: "Email and password are incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const userLogout = async (req, res) => {
    try {
        // Check if user is logged in
        if (req.session.user_id) {
            // Update user data to set isLoggedIn to false
            const userData = await User.findByIdAndUpdate(
                req.session.user_id,
                { isLoggedIn: false },
                { new: true }
            );

            // Check if user data is found
            if (userData) {
              const deleteAllEmptyUniqueId =  await User.deleteMany({
                    email: null,
                    cart: null,
                    // Add any other conditions if needed
                });
                
                // No need to save, as the document is updated directly by findByIdAndUpdate
                console.log("deleteAllEmptyUniqueId:", deleteAllEmptyUniqueId);
            }
        }

        // Destroy the session
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
};



// const verifyLogin = async(req,res)=>{

//     try {
        
//         const email = req.body.email;
//         const password = req.body.password;

//         const userData = await User.findOne({email:email});

//         if(userData){
           
//             const passwordMatch = await bcrypt.compare(password,userData.password);
//             if(passwordMatch){
//                 if(userData.is_verified === 0){
//                    res.render('login',{message:"Please verify your mail."});
//                 }
//                 else{
//                     req.session.user_id = userData._id;
//                    res.redirect('/home');
//                 }
//             }
//             else{
//                 res.render('login',{message:"Email and password is incorrect"});
//             }
//         }
//         else{
//           res.render('login',{message:"Email and password is incorrect"});
//         }

//     } catch (error) {
//         console.log(error.message);
//     }

// }

// const userLogout = async(req,res)=>{

//     try {
        
//         req.session.destroy();
//         res.redirect('/');

//     } catch (error) {
//         console.log(error.message);
//     }

// }

// forget password code start

const forgetLoad = async(req,res)=>{
    try {
        
        res.render('forget');

    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async(req,res)=>{

    try {
        
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_verified === 0){
                res.render('forget',{message:"Please verify your mail."});
            }
            else{
                const randomString = randormstring.generate();
                const updatedData = await User.updateOne({email:email},{$set:{ token:randomString }});
                sendResetPasswordMail(userData.name,userData.email,randomString);
                res.render('forget',{message:"Please check your mail to reset your password."});
            }
        }
        else{
            res.render('forget',{message:"User email is incorrect."});
        }

    } catch (error) {
        console.log(error.message);
    }

}

const forgetPasswordLoad = async(req,res)=>{

    try {
        
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id});
        }
        else{
            res.render('404',{message:"Token is invalid."});
        }

    } catch (error) {
        console.log(error.message);
    }

}

const resetPassword = async(req,res)=>{
    try {
        
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);
        
        const udupatedData = await User.findByIdAndUpdate({ _id:user_id },{ $set:{ password:secure_password, token:'' } });

        res.redirect("/");

    } catch (error) {
        console.log(error.message);
    }
}

//for verification send mail link

const verificationLoad = async(req,res)=>{

    try {
        
        res.render('verification');

    } catch (error) {
        console.log(error.message);
    }

}

const sentVerificationLink = async(req,res)=>{

    try {
        
        const email = req.body.email;
        const userData = await User.findOne({ email:email });
        if(userData){

            sendVerifyMail(userData.name, userData.email, userData._id);

            res.render('verification',{ message:"Reset verification mail sent your mail id, please check." });

        }
        else{
            res.render('verification',{message:"This email is not exist."});
        }

    } catch (error) {
        console.log(error.message);
    }

}

//user profile edit & update

const editLoad = async(req,res)=>{

    try {
        
       const id = req.query.id;

       const userData = await User.findById({ _id:id });

       if(userData){
           res.render('edit',{ user:userData });
       }
       else{
           res.redirect('/home');
       }

    } catch (error) {
        console.log(error.message);
    }

}

const updateProfile = async(req,res)=>{

    try {
        
        if(req.file){
            const userData = await User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{name:req.body.name, email:req.body.email, mobile:req.body.mno, image:req.file.filename} });
        }
        else{
           const userData = await User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{name:req.body.name, email:req.body.email, mobile:req.body.mno} });
        }

        res.redirect('/home');

    } catch (error) {
        console.log(error.message);
    }

}

const insertUser = async (req, res) => {
    try {
        const uniqueID = req.session.uniqueID;
        const { name, email, password, mno } = req.body;

        // Hash the password using securePassword function
        const spassword = await securePassword(password);

        // Assuming UniqueIDModel is a model representing your unique IDs
        // If this is not the case, adjust accordingly
        const user = new User({
            name: name,
            email: email,
            password: spassword,
            mobile: mno,
            is_admin: 0,
            uniqueID: uniqueID,
        });

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render('registration', { message: 'Email is already in use.' });
        } else {
            // Assuming you want to delete the old unique ID
            await User.deleteOne({ uniqueID: uniqueID });
            
            // Save the user data including the unique ID
            const userData = await user.save();


            if (userData) {
                sendVerifyMail(req.body.name, req.body.email, userData._id);
                res.render('registration', {
                    message: "Your registration has been successful. Please verify your mail.",
                });
            } else {
                res.render('registration', { message: "Your registration has been failed." });
            }
        }

        // Clear the unique ID from the session after registration
        req.session.uniqueID = null;
    } catch (error) {
        console.log(error.message);
        res.render('registration', { errorMessage: 'Registration failed. Please try again.' });
    }
};

const confirmBooking = async (req, res) => {
  try {
    const uniqueID = req.session.uniqueID;
    // Extract data from the request
    const { name, mno,email, price, moc, workshop ,title} = req.body;
    const scheduledDateTimes = req.body['scheduledDateTimes[]'];

    let scheduledDateTimesArray = [];

    // Check if scheduledDateTimes is defined and is an array
    if (Array.isArray(scheduledDateTimes)) {
      // Map over the array and convert each element to a Date object
      scheduledDateTimesArray = scheduledDateTimes.map(dateTime => new Date(dateTime));
    } else if (scheduledDateTimes) {
      // If it's a single value, convert it to an array with a single element
      scheduledDateTimesArray = [new Date(scheduledDateTimes)];
    }

    const formattedDates = scheduledDateTimesArray.map(dateTime => {
        const formattedDate = dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayOfWeek = dateTime.toLocaleDateString('en-US', { weekday: 'short' });
        const year = dateTime.toLocaleDateString('en-US', { year: 'numeric' });
        const time = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
      
            return `${time}, ${dayOfWeek}, ${formattedDate} ${year}`;
      });
    
    // Create a new Booking instance
    const newBooking = new Booking({
        uniqueID: uniqueID,
        name,
        mno,
        email,
        workshop,
        title,
        moc,
        price,
        scheduledDateTimes: scheduledDateTimesArray,
    });

    // Save the booking data to the database
    const userBooking = await newBooking.save();

    if (userBooking) {
        sendConfirmationMail(req.body.name, req.body.email, req.body.mno,req.body.workshop,req.body.title,req.body.moc, req.body.price,formattedDates,req.body.is_payment);
    }

    // Redirect or send a response as needed
    res.redirect('/workshop'); // Redirect to the workshop page, adjust the path as needed
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).send('Error confirming booking');
  }
};

const sendConfirmationMail = async(name, email,mno, workshop,title,moc,price,formattedDates,is_payment)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'From Krishti Art Confirmation of Scheduled Workshop Classes',
            html:`
            <p>Dear ${name},</p>
        
            <p>We are excited to confirm your registration for the upcoming workshop classes. Below are the details of your scheduled workshops:</p>
        
            <ul style="list-style-type: square;">
              <li><strong>Register Email :</strong> ${email}</li>
              <li><strong>Workshop Name :</strong> ${workshop}</li>
              <li><strong>Register Phone No :</strong> ${mno}</li>
              <li><strong>Workshop Title :</strong> ${title}</li>
              <li><strong>Mode Of Class :</strong> ${moc}</li>
              <li><strong>Workshop Fees :</strong> ${price} AUD</li>
              <li><strong>Scheduled Date and Time :</strong> ${formattedDates}</li>
              <li><strong>Fees Payment Status :</strong> ${is_payment ? 'Done' : 'Pending'}</li>
            </ul>
        
            <p>Thank you for choosing to participate in our workshops. If you have any questions or need further assistance, please feel free to reach out to us at <strong>Krishtipainting@gmail.com</strong>.</p>
        
            <p>We look forward to seeing you at the workshops!</p>
        
            <p>Best regards,<br>
            Krishti Paintings & Art Classes <br>
             +61 451496060</p>
          `
        }

    await transporter.sendMail(mailOptions);

        // Send notification email to the owner
        const ownerMailOptions = {
            from: config.emailUser,
            to: 'krishtipainting@gmail.com', // Replace with the actual owner's email
            subject: 'New Workshop Booking Notification',
            html: `
            <p>Hello Admin,</p>
            <p>A new workshop has been booked. Below are the details:</p>
            <ul style="list-style-type: square;">
            <li><strong>Student name :</strong> ${name}</li>
            <li><strong>Student Email_ID :</strong> ${email}</li>
            <li><strong>Workshop Name :</strong> ${workshop}</li>
            <li><strong>Register Phone No :</strong> ${mno}</li>
            <li><strong>Workshop Title :</strong> ${title}</li>
            <li><strong>Mode Of Class :</strong> ${moc}</li>
            <li><strong>Workshop Fees :</strong> ${price} AUD</li>
            <li><strong>Scheduled Date and Time :</strong> ${formattedDates}</li>
            <li><strong>Fees Payment Status :</strong> ${is_payment ? 'Done' : 'Pending'}</li>
          </ul>
            <p>Best regards,<br>
            Krishti Paintings & Art Classes</p>
            `
        };

       await transporter.sendMail(ownerMailOptions);

    } catch (error) {
        console.log(error.message);
    }

}

// rescheduled class code start here


const renderscheduledEditForm = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Booking.findById(productId);
      const proName = product.workshop;
      const wp = await workshopProduct.findOne({ workshop: proName });

  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      res.render('editScheduled', { product ,wp});
    } catch (error) {
      console.error('Error loading edit form:', error);
      res.status(500).send('Error loading edit form');
    }
  };
  
  const editscheduled = async (req, res) => {
    try {
      const productId = req.params.id;
      const { scheduledDateTimes } = req.body;
      const product = await Booking.findById(productId);
  
      product.scheduledDateTimes = scheduledDateTimes;
      console.log('product.scheduledDateTimes'+product.scheduledDateTimes)
      const userBooking = await product.save();

      if (userBooking) {
        sendRescheduledMail(req.body.name, req.body.email,req.body.workshop,req.body.title,req.body.scheduledDateTimes);
    }
      
      res.redirect('/account');
    } catch (error) {
      console.error('Error editing product:', error);
      res.status(500).send('Error editing product');
    }
  };
  
  
  const renderscheduledDeleteForm = async (req, res) => {
    try {
      const product = await Booking.findById(req.params.id);
      res.render('deleteScheduled', { product });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Error deleting product');
    }
  };
  
  const deletescheduled = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Booking.findById(productId);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      await Booking.findByIdAndRemove(productId);
  
      res.redirect('/account');
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Error deleting product');
    }
  };
  

  const sendRescheduledMail = async(name,email,workshop,title,scheduledDateTimes)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'From Krishti Art Confirmation of Re-Scheduled Workshop Classes',
            html:`
            <p>Dear ${name},</p>

<p>We hope this message finds you well. We would like to inform you about the rescheduled date and time for your upcoming workshop class. Below are the updated details:</p>

<ul style="list-style-type: square;">
<li><strong>Student Name :</strong> ${name}</li>
<li><strong>Student Email_ID :</strong> ${email}</li>
  <li><strong>Workshop Name :</strong> ${workshop}</li>
  <li><strong>Workshop Title :</strong> ${title}</li>
  <li><strong>Updated Scheduled Date and Time :</strong> ${scheduledDateTimes}</li>
</ul>

<p>Please note that the workshop class has been rescheduled, as per your request . If you have any questions or concerns, please feel free to reach out to us at <strong>Krishtipainting@gmail.com</strong>.</p>

<p>We look forward to seeing you at the rescheduled workshop!</p>

<p>Best regards,<br>
Krishti Paintings & Art Classes <br>
+61 451496060</p>

          `
        }

    await transporter.sendMail(mailOptions);

        // Send notification email to the owner
        const ownerMailOptions = {
            from: config.emailUser,
            to: 'krishtipainting@gmail.com', // Replace with the actual owner's email
            subject: 'Re-Scheduled Workshop Booking',
            html: `
            <p>Hello Admin,</p>
            <p>A workshop has been Re-Sheduled as per student request . Below are the details:</p>
            <ul style="list-style-type: square;">
            <li><strong>Student Name :</strong> ${name}</li>
            <li><strong>Student Email_ID :</strong> ${email}</li>
              <li><strong>Workshop Name :</strong> ${workshop}</li>
              <li><strong>Workshop Title :</strong> ${title}</li>
              <li><strong>Updated Scheduled Date and Time :</strong> ${scheduledDateTimes}</li>
            </ul>
            
            <p>Best regards,<br>
            Krishti Paintings & Art Classes</p>
            `
        };

       await transporter.sendMail(ownerMailOptions);

    } catch (error) {
        console.log(error.message);
    }

}


module.exports = {
    Productpage,
    bookClassPage,
    webLoad,
    paintingLoad,
    galleryLoad,
    customizationLoad,
    workshopLoad,
    aboutLoad,
    contactLoad,
    wishlistLoad,
    accountLoad,
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    userHomeLoad,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sentVerificationLink,
    editLoad,
    updateProfile,
    confirmBooking,
    renderscheduledEditForm,
    editscheduled,
    renderscheduledDeleteForm,
    deletescheduled,
    resendVerifyMail
    
}