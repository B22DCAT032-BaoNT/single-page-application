import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: [true, "Slug must be unique"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    comments: [
        {
            id: { type: Number, required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, required: true }
        },
    ],
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

export default Post;