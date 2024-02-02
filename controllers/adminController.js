const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require("../config/config");
const nodemailer = require("nodemailer");


// to ignore ssl certificate used below code only for development area
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const securePassword = async(password)=>{

    try {
        
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

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
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/admin/forget-password?token='+token+'"> Reset </a> your password.</p>'
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

//for send mail
const addUserMail = async(name, email, password, user_id)=>{

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
            subject:'Admin add you and Verify your mail',
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your mail.</p> <br><br> <b>Email:-</b>'+email+'<br><b>Password:-</b>'+password+''
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

const loadLogin = async(req,res)=>{
    try {
        
       res.render('login');

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{

    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){

            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){

               if(userData.is_admin === 0){
                  res.render('login',{message:"Email and password is incorrect"});
               }
               else{
                   req.session.user_id = userData._id;
                   res.redirect("/admin/home");
               }

            }
            else{
                res.render('login',{message:"Email and password is incorrect"});
            }

        }
        else{
            res.render('login',{message:"Email and password is incorrect"});
        }

    } catch (error) {
        console.log(error.message);
    }

}

const loadDashboard = async(req,res)=>{

    try {
        const userData = await User.findById({_id:req.session.user_id});
        const usersData = await User.find({is_admin:0});
        res.render('home',{admin:userData,users:usersData,message:"Status : Login"});
    } catch (error) {
        console.log(error.message);
    }

}

const logout = async(req,res)=>{
    try {
        
        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}

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
            if(userData.is_admin === 0){
               res.render('forget',{message:'Email is incorrect'});
            }
            else{
               const randomString = randomstring.generate();
               const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
               sendResetPasswordMail(userData.name, userData.email,randomString);
               res.render('forget',{message:'Please check your mail to reset your password.'});
            }
        }
        else{
           res.render('forget',{message:'Email is incorrect'});
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
        }else{
           res.render('404',{message:"Invalid Link"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try {
        
        const password = req.body.password;
        const user_id = req.body.user_id;

        const securePass = await securePassword(password);
        
        const updatedData = await User.findByIdAndUpdate({ _id:user_id },{ $set:{password:securePass,token:''} });

        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}


//* Add New Work start

const newUserLoad = async(req,res)=>{
    try {
        
        res.render('new-user');

    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const image = req.file.filename;
        const password = randomstring.generate(8);

        const spassword = await securePassword(password);

        const user = new User({
           name:name,
           email:email,
           mobile:mno,
           image:image,
           password:spassword,
           is_admin:0
        });

        const userData = await user.save();

        if(userData){
            addUserMail(name, email, password, userData._id);
           res.redirect('/admin/dashboard');
        }
        else{
           res.render('new-user',{message:'Something wrong.'});
        }

    } catch (error) {
        console.log(error.message);
    }
}

//edit user functionality

const editUserLoad = async(req,res)=>{

    try {
        const id = req.query.id;
        const userData = await User.findById({ _id:id });
        if(userData){
            res.render('edit-user',{ user:userData });           
        }
        else{
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.log(error.message);
    }

}

const updateUsers = async(req,res)=>{
    try {

        const userData = await User.findByIdAndUpdate({ _id:req.body.id },{ $set:{ name:req.body.name, email:req.body.email, mobile:req.body.mno, is_verified:req.body.verify } });
        
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}

//delete users
const deleteUser = async(req,res)=>{
    try {
        
        const id = req.query.id;

        // Check if the provided ID is valid (you might want to validate it)
        if (!id) {
          return res.status(400).send('Invalid user ID');
        }
    
        // Attempt to delete the user
        const result = await User.deleteOne({ _id: id });
    
        // Check if a user was deleted
        if (result.deletedCount > 0) {
          // User successfully deleted
          req.flash('success', 'User deleted successfully.');
        } else {
          // No user found with the provided ID
          req.flash('error', 'User not found.');
        }
    
        // Redirect back to the admin dashboard
        res.redirect('/admin/home');
    } catch (error) {
        console.log(error.message);
    }
}

//create product
const createProductLoad = async(req,res)=>{

    try {
       res.render('create');
    } catch (error) {
        console.log(error.message);
    }

}

const addProduct = async(req,res)=>{
    
    const { title } = req.body;
const image = req.file.filename;
    try {

        const productData = new Product({ title, image });

        await productData.save();
        res.redirect('productadmin');

    } catch (error) {
        console.error('Error creating data:', error);
    res.status(500).json({ error: 'Error creating data' });
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    createProductLoad,
    addProduct
}