const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req,res,next)=>{
    
    
    var headers =  req.headers.authorization
    console.log(req.headers)
    if(!headers){
        return res.status(400).send({message:"Require header"})
    }
    try {
        const user = jwt.verify(headers,process.env.secretKey)
        if(!user){
            return res.status(400).send({message:"Authorisation Failed"})
        }
        //console.log(user)
        
        next()
    } catch (error) {
        console.log("error");
       return res.status(400).send({error: error.message})
    }
}