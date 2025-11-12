import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
export default function Register() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const creds = JSON.stringify(data);
        try {
            const response = await fetch("http://localhost:8080/api/register", {
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ padding: 10 }}><br />
                <h2>Đăng Ký Tài Khoản Mới</h2>
                <span>Username:</span><br />
                <input type="text" {...register("username", { required: true })} /><br /><br />
                <span>Password:</span><br />
                <input type="password" {...register("password", { required: true })} /><br /><br />
                <button type="submit">Đăng Ký</button>
            </div>
        </form>
    );
}