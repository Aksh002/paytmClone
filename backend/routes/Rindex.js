const { Router }=require("express")
const uRoute=Router()
const { userRoute }=require("./user")
const { accRoute }=require("./account")

uRoute.use("/user",userRoute)
uRoute.use("/account",accRoute)
module.exports={
    uRoute 
}