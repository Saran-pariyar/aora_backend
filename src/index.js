import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express"

dotenv.config({
    // we're saying env file is in our root directory
    path: './.env'
})

const app = express();

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
    // app.on("error", ())
    app.on("error", (error)=>{
        console.log("Server error: ", errors)
    })
}).catch((error)=>{
    console.log("Db connection failed! ", error );
})