import mongoose, {Schema} from "mongoose";
import jwt  from "jsonwebtoken";
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

    this.password = await bcrypt.hash(this.password, 10)

    next()
})

//this method checks the password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username
},
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )

}

userSchema.methods.generateRefreshToken = function () { 

    jwt.sign({
        _id: this._id,

    },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}





// UserSchema will be sent to users model
export const User = mongoose.model("User", userSchema)
