import Post from "../models/Posts.js";

// GET /api/posts
export const getPosts = async (req, res) => {
    try {
        const { search, author } = req.query;

        const filter = {};
        if (search) {
            filter.title = { $regex: String(search), $options: "i" };
        }
        if (author) {
            filter.author = author;
        }

        const posts = await Post.find(filter).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error("Lỗi getPosts:", error);
        res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
    }
};

// GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tìm thấy" });
        }

        res.json(post);
    } catch (error) {
        console.error("Lỗi getPostBySlug:", error);
        res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
    }
};

// POST /api/posts
export const addNewPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const author = req.user.username;

        if (!title || !description) {
            return res.status(400).json({ message: "Thiếu dữ liệu title hoặc description" });
        }

        const baseSlug = title
            .toLowerCase()
            .trim()
            .replaceAll(/\W+/g, "-");

        let uniqueSlug = baseSlug;
        let count = 1;


        while (true) {
            const exists = await Post.exists({ slug: uniqueSlug });
            if (!exists) break;
            uniqueSlug = `${baseSlug}-${count++}`;
        }

        const newPost = await Post.create({
            slug: uniqueSlug,
            title,
            description,
            author,
            comments: []
        });

        res.status(201).json({
            message: "Bài viết đã được thêm thành công",
            post: newPost
        });
    } catch (error) {
        console.error("Lỗi addNewPost:", error);
        res.status(500).json({ message: "Lỗi server khi thêm bài viết" });
    }
};

// DELETE /api/posts/:slug
export const deletePost = async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await Post.findOne({ slug });
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tìm thấy" });
        }

        if (req.user.role !== 'admin' && req.user.username !== post.author) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
        }
        await Post.deleteOne({ slug });
        res.status(200).json({ message: "Bài viết đã được xóa thành công" });

    } catch (error) {
        console.error("Lỗi deletePost:", error);
        res.status(500).json({ message: "Lỗi server khi xóa bài viết" });
    }
};

// PUT /api/posts/:slug
export const updatePost = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tìm thấy" });
        }
        if (req.user.username !== post.author) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa bài viết này" });
        }

        const { title, description } = req.body;
        if (title) post.title = title;
        if (description) post.description = description;
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        console.error("Lỗi updatePost:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
    }
};

// POST /api/posts/:slug/comments
export const addCommentToPost = async (req, res) => {
    try {
        const { slug } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }

        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tìm thấy" });
        }

        const newComment = {
            id: Date.now(),
            text,
            timestamp: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json(newComment);
    } catch (error) {
        console.error("Lỗi addCommentToPost:", error);
        res.status(500).json({ message: "Lỗi server khi thêm bình luận" });
    }
};

// GET /api/posts/:slug/comments
export const getCommentsOfPost = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ message: "Bài viết không tìm thấy" });
        }

        res.json(post.comments || []);
    } catch (error) {
        console.error("Lỗi getCommentsOfPost:", error);
        res.status(500).json({ message: "Lỗi server khi lấy bình luận" });
    }
};
