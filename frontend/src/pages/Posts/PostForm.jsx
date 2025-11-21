// src/components/posts/PostForm.jsx
import React from "react";
import { useForm } from "react-hook-form";

export default function PostForm({
    initialValues = { title: "", description: "" },
    onSubmit,
    submitLabel = "Lưu",
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" {...register("title", { required: true })} />
                {errors.title && (
                    <span className="form-error">Yêu cầu nhập tiêu đề!</span>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" style={{ minHeight: '100px' }} {...register("description", { required: true })} />
                {errors.description && (
                    <span className="form-error">Yêu cầu nhập mô tả!</span>
                )}
            </div>

            <button type="submit" className="form-button">{submitLabel}</button>
        </form>
    );
}
