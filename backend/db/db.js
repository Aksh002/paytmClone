const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm")
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        minLength:3,
        maxLength:30,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        minLength:6,
        required:true,
        trim:true
    },
    firstname:{
        type:String,
        maxLength:50,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        maxLength:50,
        required:true,
        trim:true
    }
})

export const User=mongoose.model("Users",UserSchema)