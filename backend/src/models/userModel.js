import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"], // true
    }, 
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true
    }
})