import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    // we're saying env file is in our root directory
    path: './.env'
})


connectDB();