const express=require("express")
const app=express()

const { uRoute }=require("./routes/Rindex")

const { default: mongoose } = require("mongoose")
const cors=require("cors")
const jwt=require("jsonwebtoken") 

app.use(express.json())
app.use(cors())

app.use("/api/v1",uRoute)

app.listen(3000)


