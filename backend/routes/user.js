const { Router,json } = require("express")
const userRoute=Router()
const jwt=require("jsonwebtoken")
const zod=require("zod")
const { User, Acc }=require("../db/db")
const { userAuth } = require("../middlewares/userAuth")
const { secret } = require("../config")


userRoute.get("/me",async function(req,res,next){
    const authToken=req.headers.token
    if (!authToken){
        return res.status(403).json({
            msg:"No token recieved"
        })
    }
    const {id}=jwt.decode(authToken)
    const user=await User.findOne({_id:id})
    if (!user){
        return res.json({
            msg:"User not found"
        })
    }
    res.status(200).json({
        user
    })

})
//userRoute.use(json())
const userSchema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(6),
    firstname:zod.string(),
    lastname:zod.string()
})
userRoute.post("/signup",async function(req,res){
    const { success }=userSchema.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:"Invalid entries"
        })
    }

    const found=await User.findOne({username:req.body.username})
    if(found){
        return res.status(401).json({
            msg:"User already exist by this id"
        })
    }

    const { username,password,firstname,lastname }=req.body
    const user=new User({                                                                                 // new User() is used instead of "await User.create()" bcs we are entering password hashing so cant include pswd in create fxn, which will throw error bcs pswd has required:true
        username:username,
        firstname:firstname,
        lastname:lastname
        // Can put req.body instead of all this
    })

    // Hashing pswd and then storing it
    user.pswd_hash=await user.createHash(password)
    await user.save()

    const token=jwt.sign({username:req.body.username,id:user._id},secret,{ expiresIn: "1h" })               // Expires one is optional

    const id=user._id
    await Acc.create({
        userId:id,
        balance:Math.floor(Math.random() * 1000) + 1
    })
    

    res.status(207).json({
        msg:"USer created successfully",
        id:user._id,
        token:token

    }) 
})

const loginSchema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(6)
})
userRoute.post("/signin",async function(req,res){
    const { success }=loginSchema.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            msg:"Invalid entries"
        })
    }
    const {username,password}=req.body
    const user=await User.findOne({
        username:username
    })
    if (user==null){
        res.status(401).json({
            msg:"User not found"
        })
    }
    else{
        if (user.validatePswd(password)){
            const token=jwt.sign({username:username,id:user._id},secret)               // Expires one is optional
            res.status(200).json({
                firstname:user.firstname,
                userId:token,
                id: user._id
            })
        }
        else{
            return res.status(411).json({
                msg:" Incorrect email or password"
            })
        }
    }
})

const updateScema=zod.object({
    username:zod.string().email().optional(),
    password:zod.string().min(6).optional(),
    firstname:zod.string().optional(),
    lastname:zod.string().optional()
})
userRoute.put("/",userAuth,async function(req,res){
    const {success}=updateScema.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            msg:"invalid input"
        })
    }
    const { username,password,firstname,lastname }=req.body

    const updateData={}
    if (username){
        // Check if the new username already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser && existingUser._id.toString() !== req.id) {
            return res.status(409).json({
                msg: "Id already exists with the provided email"
            });
        }
        updateData.username = username;
    }
    if (firstname){updateData.firstname=firstname}
    if (lastname){updateData.lastname=lastname}
    if (password){
        const user=await User.findOne({_id:req.id})
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        updateData.pswd_hash=await user.createHash(password)
    }
    await User.updateOne({_id:req.id},{$set:updateData})
    res.status(200).send({
        msg:"Data updated succesfully"
    })
})

// IMPORTANT
// THis route sends a list of info of all the users whose name matches with prvided filter 
// KEY_LEARNING: We learn how to do query to mongoose db so that it returns entries LIKE the enter string, just like how LIKE works for sql
//               Also learn how to do OR queries in mongodb
userRoute.get("/bulk",userAuth,async function (req,res) {
    const filter=req.query.filter  || ""

    // THis is how u implement Regex and Or in mongoose
    const users=await User.find({
        $or:[{
            firstname:{
                "$regex":filter
            }
        },{
            lastname:{
                "$regex":filter
            }
        }]
    })
    res.status(200).json({
        users:users.map((user)=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            id:user._id
        }))
    })
})
module.exports={
    userRoute
}
