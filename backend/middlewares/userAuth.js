const jwt=require("jsonwebtoken")
const { secret }=require("../config")

const userAuth=(req,res,next)=>{
    const token=req.headers.authorization
    if (!token || !token.startsWith("Bearer ")){
        res.status(411).json({})
    }
    const word=token.split(" ")
    const jwtToken=word[1]
    try{
        const decoded=jwt.verify(jwtToken,secret)
        req.username=decoded.username
        req.id=decoded.id
        next()
    }
    catch(e){
        res.status(403).json({
            msg:"You are not authenticated"
        })
    }   
}
module.exports={
    userAuth
}