import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async(req, res)=>{

    const { email, username, password } = req.body
    console.log("Request Body:", req.body);


    if (
        // you can also use checking one by one but using some() is faster
        // now if even one field is empty, it will return true in that place
  
        [email, username, password].some((field) => field?.trim() === "")
     ) {
        throw new ApiError(400, "All fields are required")
     }

        //checking if user already exist
   const existedUser = await User.findOne({
    // we can use operators like this using $ sign
    // now it will return first document which matches
    $or: [{ username }, { email }]
 })

 if (existedUser) {
    throw new ApiError(409, "User with email or username already exist")
 }

//  Create user obj & send to db 
const user = await User.create({
    email,
    username,
    password
})

//checking user collection
   // in select, we mean don't include/return password and refreshToken
   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if (!createdUser) {

      throw new ApiError(500, "Something went wrong while registering the user")
   }

    // Return response
    return res.status(201).json(
        //user ApiResponse for more structured way
        new ApiResponse(200, createdUser, "User registered successfully")
  
     )

})

export {registerUser}