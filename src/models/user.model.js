import mongoose, {Schema} from "mongoose";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: false,
        trim: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }

})

// Mongoose middleware that runs before sending data to db. Don't use arrow function
userSchema.pre("save", async function(next){

    // this -> userSchema
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
})

//this method checks the password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

// UserSchema will be sent to users model
export const User = mongoose.model("User", userSchema)
