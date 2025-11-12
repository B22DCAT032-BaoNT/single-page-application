import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function NewPost() {

    const [newPost, setNewPost] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        const post = JSON.stringify(data);
        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: post,
            });
            if (response.ok) {
                setNewPost("Bài viết đã được thêm thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm bài viết:", error);
            setNewPost("Đã xảy ra lỗi khi thêm bài viết.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ padding: 10 }}><br />
                <h2>Thêm Bài Viết Mới</h2>
                <span>Slug:</span><br />
                <input type="text" {...register("slug", { required: true })} /><br />
                {errors.slug && <span style={{ color: 'red' }}>Yêu cầu nhập slug!</span>}<br />

                <span>Title:</span><br />
                <input type="text" {...register("title", { required: true })} /><br />
                {errors.title && <span style={{ color: 'red' }}>Yêu cầu nhập tiêu đề!</span>}<br />

                <span>Description:</span><br />
                <textarea {...register("description", { required: true })} /><br />
                {errors.description && <span style={{ color: 'red' }}>Yêu cầu nhập mô tả!</span>}<br /><br />

                <button type="submit">Thêm Bài Viết</button>
                <div style={{ marginTop: 10, color: 'green' }}>{newPost}</div>
            </div>
        </form>
    );
}