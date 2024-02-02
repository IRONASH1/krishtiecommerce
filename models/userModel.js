const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uniqueID: { type: String, unique: true },
    createdAt: { type: Date },
    name:{
        type:String,
    },
    email:{
        type:String,
    
    },
    mobile:{
        type:String,
    
    },
    image:{
        type:String,
    },
    password:{
        type:String,
    
    },
    is_admin:{
        type:Number,
        default:0
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    }
,
verificationCode: { type: String },
verificationCodeExpiry: { type: Date },
isLoggedIn: { type: Boolean, default: false },
});


module.exports =  mongoose.model('User',userSchema);