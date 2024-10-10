const express=require("express")
const { default: mongoose } = require("mongoose")
const app=express()
const { userRoute }=require("./routes/user")

app.use(express.json())
app.use("/api/v1",userRoute)

app.listen(3000)


