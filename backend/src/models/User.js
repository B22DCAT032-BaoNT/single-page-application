import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    gmail: {
        type: String,
        required: [true, "Gmail is required"],
        unique: [true, "Gmail must be unique"],
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        default: "user",
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
