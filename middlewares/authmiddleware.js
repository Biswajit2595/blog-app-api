const jwt=require("jsonwebtoken");


const auth=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try {
        const decoded=jwt.verify(token,'revision')
        if(decoded){
            req.body.userID=decoded.userID
            req.body.username=decoded.username
            next()
        }else{
            res.status(400).send({'error':"Please Login Again"})
        }
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
}

module.exports={auth}