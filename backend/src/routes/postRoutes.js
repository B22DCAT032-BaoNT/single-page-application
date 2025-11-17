// src/routes/postRoutes.js
import express from "express";
import {
    getPosts,
    getPostBySlug,
    addNewPost,
    deletePost,
    updatePost,
    addCommentToPost,
    getCommentsOfPost,
} from "../controllers/PostController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", addNewPost);
router.put("/:slug", updatePost);
router.delete("/:slug", deletePost);

router.post("/:slug/comments", addCommentToPost);
router.get("/:slug/comments", getCommentsOfPost);

export default router;
