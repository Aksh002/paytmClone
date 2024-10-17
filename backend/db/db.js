const { default: mongoose } = require("mongoose");
const bcrypt=require("bcrypt")

mongoose.connect("mongodb://localhost:27017/paytm").catch(()=>{
    console.log("Database down")
})

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        minLength:3,
        maxLength:30,
        required:true,
        unique:true,
        trim:true
    },
    pswd_hash: {
        type: String,
        required: true
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


// Method to generate a hash of pswd from plain text
UserSchema.methods.createHash=async function(pswd){
    // Hashing user's salt and password with 10 iterations,
    const saltRounds=10

    // First method to generate a salt and then create hash
    const salt=await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(pswd,salt)
    
    // Second mehtod - Or we can create salt and hash in a single method also
    // return await bcrypt.hash(plainTextPassword, saltRounds);
}

// Validating the candidate password with stored hash and hash function
UserSchema.methods.validatePswd=async function (pswd) {
    return await bcrypt.compare(pswd,this.pswd_hash)
}
const User=mongoose.model("Users",UserSchema)


// Account table
const AccSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,                // ObjectId refers to user._id of the table mantioned in the ref section
        ref:'User',
        required:true
        
    },
    balance:{
        type:Number,
        required:true
    }
})
const Acc=mongoose.model("Accounts",AccSchema)
module.exports={
    User,
    Acc
}
