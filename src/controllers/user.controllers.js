import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async(req, res)=>{

    const { email, username, password } = req.body


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

const loginUser = asyncHandler(async(req, res)=>{

   const {email, password} = req.body

   if( !(email && password) ){
      throw new ApiError(400, "Both email and password are required")
   }

   //if user exist or not
   const existedUser = await User.findOne({ email })
   if(!existedUser){
      throw new ApiError(404, "User does not exist")
   }

   const isPasswordValid = await existedUser.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401, "Invalid user credentials")
   }

   const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

   return res.status(200).json(
      new ApiResponse(200, {user: loggedInUser}, "User logged in Successfully")
   )

})

export {registerUser, loginUser}