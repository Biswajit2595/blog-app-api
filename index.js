const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { userRouter } = require("./Routes/userRoutes")
const { postRouter } = require("./Routes/postRoutes")
const app=express()
app.use(express.json())
app.use(cors())

app.use("/",userRouter)
app.use("/blogs",postRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to the home Page")
})

app.listen(4000,async(req,res)=>{
    try {
        await connection
        console.log("connected to Mongodb")
    } catch (error) {
        res.status(500).send({"Error":error})
    }
})