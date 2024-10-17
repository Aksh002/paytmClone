const { Router,json } = require("express")
const { userAuth } = require("../middlewares/userAuth")
const { Acc, User } = require("../db/db")
const { default: mongoose } = require("mongoose")
const accRoute=Router()
const zod=require("zod")

accRoute.use(userAuth)
//accRoute.use(json())

accRoute.get("/balance",async function (req,res) {
    const acc=await Acc.findOne({
        userId:req.id
    })
    res.status(200).json({
        balance: acc.balance
    })
})

accRoute.post("/transfer",async function (req,res) {

    //                          BAD SOLUTION
    // THis way is fine, but not robust as if either db goes down or node server goes down and only ine req is executed then there will be disperencies in data
    /*
    const { id,amount }=req.body

    const sender=await Acc.findOne({
        userId:req.id
    })
    if (sender.balance<amount+10){
        res.status(411).json({
            msg:"Insufficient balance,going below 10/-"
        })
    }

    const reciever= await Acc.findOne({
        userId:id
    })
    if (!reciever){
        res.status(411).json({
            msg:"Invalid acc, Reciever does not exist"
        })
    }

    // Debeting and crediting t he amaount
    await Acc.updateOne({
        userId:req.id
    },{
        $inc:{
            balance:-amount
        }
    })
    await Acc.updateOne({
        userId:req.id
    },{
        $inc:{
            balance:-amount
        }
    })

    res.status(200).json({
        msg:"Transaction Successfull"
    })
    */

    //                                  EFFECTIVE AND ROBUST SOLUTON
    // In this way we encapsulate debeting and crediting fxn in Transaction to make sure either both happens or none happens
    // We implement this by:- Creating a Session
    // A session says im gonna do bunch of things, if anyone fails and control doesnt reach the session commit command, fcking revert
    const session= await mongoose.startSession()
    try{
        
        session.startTransaction()
        //----------------------------------------------------------------------
        
        const trSchema=zod.object({
            userId: zod.string(),
            amount: zod.number()
        })
        const { success }=trSchema.safeParse(req.body)
        if (!success){
            await session.abortTransaction()
            return res.status(401).json({
                msg:"Invslid Inputs"
            })
        }
        const { userId,amount }=req.body
        const sender=await Acc.findOne({
            userId:req.id
        }).session(session)
        if (sender.balance<amount+10){
            await session.abortTransaction()                        // Aborted
            return res.status(411).json({
                msg:"Insufficient balance,going below 10/-"
            })
        }

        const reciever= await Acc.findOne({
            userId:userId
        }).session(session)
        if (!reciever){
            await session.abortTransaction()                        // Aborted
            return res.status(400).json({
                msg:"Invalid acc, Reciever does not exist"
            })
        }

        // Debeting and crediting t he amaount
        await Acc.updateOne({
            userId:req.id
        },{
            $inc:{
                balance:-amount
            }
        })
        await Acc.updateOne({
            userId:userId
        },{
            $inc:{
                balance:amount
            }
        })
        //---------------------------------------------------------------------
        await session.commitTransaction()
        await session.endSession()
    }
    catch(e){
        await session.abortTransaction()
        return res.status(401).json({
            msg:"Transaction Under Proccess"
        })
    }
    res.status(200).json({
        msg:"Transaction Successfull"
    })
    // This way also solves another issue,Issue:- say user has 20rs, he sends 2 consecutive req for transfer, smtimes the delay can fool the if(sender.balance<amount+10) check to allow 2nd request which should not happen
    // In this way, 2nd req is only proccessed when session of 1st is resolved completely
    // Mongoose wont let u read a datapoint that is currently being updated, so it will thro error on 2nd transaction , and that error is handeled by try catch block. So this way same user cant do concurrent req
})

module.exports={
    accRoute
}