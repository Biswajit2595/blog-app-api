const express=require("express");
const { PostModel } = require("../Model/postModel");
const { auth } = require("../middlewares/authmiddleware");

const postRouter=express.Router();

postRouter.post("/",auth,async(req,res)=>{
    try {
        const newPost=new PostModel(req.body)
        await newPost.save();
        res.status(201).send({"msg":"blog has been added"})
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})


postRouter.get("/",async(req,res)=>{
    const {title,category,sort,order}=req.query;
    const query={}
    const sorting={}
    if(title){
        query.title={$regex:title,$options:"i"}
    }
    if(category){
        query.category={$regex:category,$options:"i"}
    }
    if(sort && order){
        if(order="asc"){
            sorting.date=1
        }
        else{
            sorting.date=-1
        }
    }
    try {
        const blogs=await PostModel.find(query).sort(sorting)
        res.status(200).send(blogs)
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})

postRouter.patch("/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        if(req.body.userId!==post.userId){
            res.status(400).send({"msg":"You are not authorized to update this post"})
        }else{
            const update=await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(201).send({"msg":"Post has been updated"})
        }
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})

postRouter.delete("/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        if(req.body.userId!==post.userId){
            res.status(400).send({"msg":"You are not authorized to delete this post"})
        }else{
            const update=await PostModel.findByIdAndDelete({_id:id})
            res.status(201).send({"msg":"Post has been deleted"})
        }
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})

postRouter.patch("/:id/like",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        const like=post.likes+1;
        const update=await PostModel.findByIdAndUpdate({_id:id},{...req.body,likes:like})
        res.status(201).send({"msg":"Likes has been updated"})
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})

postRouter.patch("/:id/comment",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        const comment={username:req.body.username,content:req.body.content}
        post.comments.push(comment)
        const update=await PostModel.findByIdAndUpdate({_id:id},post)
        res.status(201).send({"msg":"Comments has been updated"})
    } catch (error) {
        res.status(500).send({"error":"Internal server Error"})
    }
})




module.exports={postRouter}