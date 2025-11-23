import express from "express";
import {
    getPosts,
    getPostBySlug,
    addNewPost,
    deletePost,
    updatePost,
    addCommentToPost,
    getCommentsOfPost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.get("/:slug/comments", getCommentsOfPost);

router.post("/", verifyToken, addNewPost);
router.post("/:slug/comments", verifyToken, addCommentToPost);

router.put("/:slug", verifyToken, updatePost);
router.delete("/:slug", verifyToken, deletePost);

export default router;
