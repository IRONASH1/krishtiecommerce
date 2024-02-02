const User = require('../models/userModel'); 

const isLogin = async (req, res, next) => {
    try {
        const user_id = req.session.user_id;

        if (user_id) {
            const user = await User.findById(user_id);

            if (user) {
                if (user.is_admin === 1) {
                    next();
                } else {
                    res.redirect('/admin');
                }
            } else {
                res.redirect('/admin');
            }
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        res.redirect('/error');
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // Check if the user is an admin
            const user = await User.findById(req.session.user_id);

            if (user && user.is_admin === 1) {
                res.redirect('/admin/home');
            } else {
                next();
            }
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};



// const isLogin = async(req,res,next)=>{
//     try {
        
//         if(req.session.user_id){}
//         else{
//             res.redirect('/admin');
//         }
//         next();

//     } catch (error) {
//         console.log(error.message);
//     }
// }

// const isLogout = async(req,res,next)=>{
//     try {
        
//         if(req.session.user_id){
//              res.redirect('/admin/home');
//         }
//         next()

//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = {
//     isLogin,
//     isLogout
// }



// {
//     const user_id =req.session.user_id;
//     if (user_id) {
//         // Fetch user data from the database using the user_id
//         User.findById(user_id, (err, user) => {
//             if (err) {
//                 console.error('Error fetching user data:', err);
//                 // Handle the error, e.g., redirect the user to an error page
//                 res.redirect('/error');
//             } else {
//                 // The 'user' variable now contains all data associated with the user_id
//                 console.log('User data:', user);
    
//                 // Check if the user is an admin
//                 const is_admin = user.is_admin;
    
//                 // Now 'is_admin' contains the value of the is_admin property for the user
//                 console.log('Is admin:', is_admin);
    
//                 // Continue with your logic...
    
//                 // If you want to find other users with the same is_admin value
//                 User.find({ is_admin: is_admin }, (err, adminUsers) => {
//                     if (err) {
//                         console.error('Error fetching admin users:', err);
//                         // Handle the error
//                     } else {
//                         console.log('Admin users:', adminUsers);
//                         // Continue with your logic...
//                     }
//                 });
//             }
//         });
//     }