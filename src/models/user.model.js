import mongoose, {Schema} from "mongoose";

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

// UserSchema will be sent to user model
export const User = mongoose.model("User", userSchema)
