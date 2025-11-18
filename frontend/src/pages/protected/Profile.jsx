import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostForm from '../posts/PostForm.jsx';

export default function Profile({ user }) {
    const [myPosts, setMyPosts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingSlug, setEditingSlug] = useState(null);

    const fetchMyPosts = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:8080/api/posts?author=${user.username}`);
            const data = await response.json();
            setMyPosts(data);
        } catch (error) {
            console.error("Lỗi tải bài viết:", error);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, [user]);

    // 1. XỬ LÝ THÊM BÀI VIẾT MỚI
    const handleCreatePost = async (data) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setIsCreating(false);
                fetchMyPosts();
                alert("Đăng bài thành công!");
            }
        } catch (error) { console.error(error); }
    };

    // 2. XỬ LÝ XÓA BÀI VIẾT
    const handleDelete = async (slug) => {
        if (!globalThis.confirm("Bạn chắc chắn muốn xóa bài này?")) return;
        const token = localStorage.getItem("accessToken");
        try {
            await fetch(`http://localhost:8080/api/posts/${slug}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                alert("Xóa bài thành công!");
                fetchMyPosts();
            }
        } catch (error) { console.error(error); }
    };

    // 3. XỬ LÝ CẬP NHẬT BÀI VIẾT
    const handleUpdate = async (data, slug) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setEditingSlug(null);
                fetchMyPosts();
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ padding: 20 }}>
            {/* Phần thông tin User */}
            <div style={{ padding: 15, borderRadius: 8, marginBottom: 20 }}>
                <h2>Hồ sơ: {user?.username}</h2>
                <p>Gmail: {user?.gmail}</p>
            </div>

            <div style={{ marginBottom: 30 }}>
                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{ background: 'green', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                    >
                        + Viết bài mới
                    </button>
                ) : (
                    <div style={{ border: '1px solid green', padding: 15, borderRadius: 5 }}>
                        <h3>Tạo bài viết mới</h3>
                        <PostForm onSubmit={handleCreatePost} submitLabel="Đăng ngay" />
                        <button onClick={() => setIsCreating(false)} style={{ marginTop: 10 }}>Hủy</button>
                    </div>
                )}
            </div>

            <hr />

            <h3>Danh sách bài viết của bạn ({myPosts.length})</h3>
            <div>
                {myPosts.map(post => (
                    <div key={post._id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 5 }}>

                        {editingSlug === post.slug ? (
                            <div>
                                <h4 style={{ color: 'orange' }}>Đang chỉnh sửa: {post.title}</h4>
                                <PostForm
                                    initialValues={{ title: post.title, description: post.description }}
                                    onSubmit={(data) => handleUpdate(data, post.slug)}
                                    submitLabel="Lưu thay đổi"
                                />
                                <button onClick={() => setEditingSlug(null)} style={{ marginTop: 10 }}>Hủy bỏ</button>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ marginTop: 0 }}>
                                    <Link to={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <div style={{ fontSize: '0.85rem', marginBottom: 10 }}>
                                    <span>Ngày đăng: {new Date(post.createdAt).toLocaleString()}</span>
                                    {post.updatedAt !== post.createdAt &&
                                        <span style={{ marginLeft: 10 }}>(Đã sửa: {new Date(post.updatedAt).toLocaleString()})</span>
                                    }
                                </div>

                                <p style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {post.description}
                                </p>
                                <details style={{ marginBottom: 15, padding: 5 }}>
                                    <summary style={{ cursor: 'pointer' }}>Xem bình luận ({post.comments.length})</summary>
                                    <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                                        {post.comments.map(c => (
                                            <li key={c.id} style={{ fontSize: '0.9rem' }}>
                                                <strong>Ẩn danh</strong>: {c.text} <span style={{ color: '#888', fontSize: '0.7rem' }}>({new Date(c.timestamp).toLocaleString()})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </details>

                                <div>
                                    <button
                                        onClick={() => setEditingSlug(post.slug)}
                                        style={{ marginRight: 10, padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        Sửa bài
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        style={{ background: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        Xóa bài
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {myPosts.length === 0 && <p>Bạn chưa viết bài nào cả.</p>}
            </div>
        </div>
    );
}