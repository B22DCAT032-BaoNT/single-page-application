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
        <div className="page-container">
            {/* Phần thông tin User */}
            <div className="profile-header">
                <h2 className="profile-header__username">Hồ sơ: {user?.username}</h2>
                <p className="profile-header__email">Gmail: {user?.gmail}</p>
            </div>

            <div className="mb-24">
                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-success"
                    >
                        + Viết bài mới
                    </button>
                ) : (
                    <div className="card">
                        <h3 className="mb-16">Tạo bài viết mới</h3>
                        <PostForm onSubmit={handleCreatePost} submitLabel="Đăng ngay" />
                        <button onClick={() => setIsCreating(false)} className="btn-secondary mt-16">Hủy</button>
                    </div>
                )}
            </div>

            <h3 className="mb-16">Danh sách bài viết của bạn ({myPosts.length})</h3>
            <div>
                {myPosts.map(post => (
                    <div key={post._id} className="post-card">

                        {editingSlug === post.slug ? (
                            <div className="post-card__content">
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Đang chỉnh sửa: {post.title}</h4>
                                <PostForm
                                    initialValues={{ title: post.title, description: post.description }}
                                    onSubmit={(data) => handleUpdate(data, post.slug)}
                                    submitLabel="Lưu thay đổi"
                                />
                                <button onClick={() => setEditingSlug(null)} className="btn-secondary mt-16">Hủy bỏ</button>
                            </div>
                        ) : (
                            <>
                                <div className="post-card__header">
                                    <Link to={`/posts/${post.slug}`}>
                                        <h3 className="post-card__title">{post.title}</h3>
                                    </Link>
                                    <div className="post-card__meta">
                                        <span>Ngày đăng: {new Date(post.createdAt).toLocaleString()}</span>
                                        {post.updatedAt !== post.createdAt &&
                                            <span style={{ marginLeft: 10 }}>(Đã sửa: {new Date(post.updatedAt).toLocaleString()})</span>
                                        }
                                    </div>
                                </div>

                                <div className="post-card__content">
                                    <p className="post-card__description" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                                        {post.description}
                                    </p>
                                    <details style={{ marginTop: 15, padding: 8 }}>
                                        <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Xem bình luận ({post.comments.length})</summary>
                                        <ul className="comment-list" style={{ marginTop: 10 }}>
                                            {post.comments.map(c => (
                                                <li key={c.id} className="comment-item">
                                                    <p className="comment-item__text">{c.text}</p>
                                                    <small className="comment-item__meta">{new Date(c.timestamp).toLocaleString()}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </div>

                                <div className="post-card__footer action-buttons">
                                    <button
                                        onClick={() => setEditingSlug(post.slug)}
                                        className="btn-secondary"
                                    >
                                        Sửa bài
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        className="btn-danger"
                                    >
                                        Xóa bài
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {myPosts.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Bạn chưa viết bài nào cả.</p>}
            </div>
        </div>
    );
}