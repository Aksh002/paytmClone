const { Router }=require("express")
const router=Router()
const { userRoute }=require("./user")

router.use("/user",userRoute)
router.use("/account",accRoute)
module.exports={
    router 
}