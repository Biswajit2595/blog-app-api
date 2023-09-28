const express=require("express");
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken");
const { UserModel } = require("../Model/userModel");


const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const exists=await UserModel.findOne({email})
        if(exists){
            res.status(200).send({"msg":"User already Exists"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).send({"error":err})
                }else{
                    const newUser=new UserModel({...req.body,password:hash})
                    await newUser.save();
                    res.status(200).send({"msg":"New user has been registered"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            res.status(200).send({"msg":"User does not exist,please register"})
        }else{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,username:user.username},'revision')
                    res.status(200).send({"msg":"user Logged in",token,username:user.username,userId:user._id})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})




module.exports={userRouter}