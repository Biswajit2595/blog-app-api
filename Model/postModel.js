const mongoose=require('mongoose')


const postSchema=mongoose.Schema({
    userId:String,
    username:String,
    title:String,
    content:String,
    category:String,
    date:String,
    likes:Number,
    comments:[]
},{versionKey:false})


const PostModel=mongoose.model("post",postSchema)


module.exports={PostModel}