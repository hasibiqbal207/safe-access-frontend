import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"], // true
    }, 
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: [true, "Email already exists"], // true
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    picture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    status: {
        type: String,
        default: "Hey there, I'm using whatsapp"
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be at least 6 characters"], // 6,
        maxLength: [20, "Password must be less than 20 characters"], // 20
    }
}, {
    collection: "users",
    timestamps: true,
})

userSchema.pre("save", async function(next) {
    try {
        if(this.isNew) {
            const salt = await bcrypt.genSalt(12); 
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
})

const UserModel = mongoose.model.UserModel || mongoose.model("UserModel", userSchema);
export default UserModel;