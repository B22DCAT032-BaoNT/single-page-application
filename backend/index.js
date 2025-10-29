
import express from 'express';
import cors from 'cors';
import { BlogPosts } from './BlogPosts.js';

const app = express();
const PORT = 8080;

app.use(cors());

app.get("/api/posts", (req, res) => {
    console.log("Backend: Đã nhận yêu cầu GET /api/posts");
    res.json(BlogPosts);
});

app.get("/api/post/:slug", (req, res) => {
    const { slug } = req.params;
    console.log(`Backend: Đã nhận yêu cầu GET /api/post/${slug}`);

    const post = BlogPosts.find((p) => p.slug === slug);

    if (post) {

        res.json(post);
    } else {

        res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});