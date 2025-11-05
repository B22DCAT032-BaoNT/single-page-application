
import express from 'express';
import cors from 'cors';
import { BlogPosts } from './BlogPosts.js';

const app = express();
const PORT = 8080;

app.use(cors());

app.get("/api/posts", (req, res) => {
    console.log("Backend: Đã nhận yêu cầu GET /api/posts");
    const { search } = req.query;

    if (search) {
        console.log(`Backend: Tìm kiếm bài viết với từ khóa: ${search}`);
        const filteredPosts = BlogPosts.filter(post => {
            const searchTerm = String(search).toLowerCase();
            return post.title.toLowerCase().includes(searchTerm);
        });
        res.json(filteredPosts);
    } else {
        console.log("Backend: Không có từ khóa, trả về tất cả.");
        res.json(BlogPosts);
    }

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