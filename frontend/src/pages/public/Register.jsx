import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React from "react";
export default function Register() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const creds = JSON.stringify(data);
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: creds,
            });
            if (response.ok) {
                navigate('/login');
            }
        }
        catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            setNewCreds("Đăng ký thất bại!");
        }
    }

    return (
        <div className="page-container">
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)} className="form-card">
                    <h2 className="text-center mb-24">Đăng Ký Tài Khoản Mới</h2>

                    <div className="form-group">
                        <label className="form-label">Gmail</label>
                        <input type="email" className="form-input" {...register("gmail", { required: true })} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tên người dùng</label>
                        <input type="text" className="form-input" {...register("username", { required: true })} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input type="password" className="form-input" {...register("password", { required: true })} />
                    </div>

                    <button type="submit" className="form-button">Đăng Ký</button>
                </form>
            </div>
        </div>
    );
}