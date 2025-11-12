import express from 'express';
import cors from 'cors';
import { BlogPosts } from './BlogPosts.js';
import { LoginCreds } from './LoginCreds.js';
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
    const creds = {
        username: req.body.username,
        password: req.body.password,
    };

    const foundUser = LoginCreds.find(user =>
        user.username === creds.username && user.password === creds.password
    );

    if (foundUser) {
        const userToSend = {
            username: foundUser.username,
            role: foundUser.role
        };
        res.status(200).json({ user: userToSend });
    } else {
        res.status(401).json({ message: "Đăng nhập thất bại" });
    }
});

app.post("/api/register", (req, res) => {
    const creds = {
        username: req.body.username,
        password: req.body.password,
        role: "user"
    }
    LoginCreds.push(creds);
    res.status(201).json({ message: "Đăng ký thành công" });
})

app.post("/api/posts", (req, res) => {
    const post = {
        slug: req.body.slug,
        title: req.body.title,
        description: req.body.description,
        comments: []
    }
    BlogPosts.push(post);
    res.status(200).json({ message: "Bài viết đã được thêm thành công" });
});

app.delete("/api/post/:slug", (req, res) => {
    const { slug } = req.params;
    const postIndex = BlogPosts.findIndex((p) => p.slug === slug);
    if (postIndex !== -1) {
        BlogPosts.splice(postIndex, 1);
        res.status(200).json({ message: "Bài viết đã được xóa thành công" });
    } else {
        res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
});

app.put("/api/post/:slug", (req, res) => {
    const { slug } = req.params;
    const { title, description } = req.body;
    const post = BlogPosts.find((p) => p.slug === slug);
    if (post) {
        post.title = title;
        post.description = description;
        res.status(200).json(post);
    } else {
        res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
});

app.post("/api/post/:slug/comments", (req, res) => {
    const { slug } = req.params;
    const { text } = req.body;

    const post = BlogPosts.find((p) => p.slug === slug);
    if (post) {
        const newComment = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString()
        };
        post.comments.push(newComment);
        res.status(200).json(newComment);
    }
    else {
        res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
});

app.get("/api/post/:slug/comments", (req, res) => {
    const { slug } = req.params;
    const post = BlogPosts.find((p) => p.slug === slug);
    if (post) {
        res.json(post.comments);
    }
    else {
        res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
})
app.get("/api/posts", (req, res) => {
    const { search } = req.query;

    if (search) {
        const filteredPosts = BlogPosts.filter(post => {
            const searchTerm = String(search).toLowerCase();
            return post.title.toLowerCase().includes(searchTerm);
        });
        res.json(filteredPosts);
    } else {
        res.json(BlogPosts);
    }

});

app.get("/api/post/:slug", (req, res) => {
    const { slug } = req.params;
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

