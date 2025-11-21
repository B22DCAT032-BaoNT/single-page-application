import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login({ onLogin }) {
    const [creds, setCreds] = useState({});
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creds),
            });


            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem("accessToken", data.token);
                }
                onLogin(data.user);
                navigate("/");
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
        }
    }

    return (
        <div className="page-container">
            <div className="form-container">
                <div className="form-card">
                    <h2 className="text-center mb-24">Login</h2>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            onChange={(e) => setCreds({
                                ...creds,
                                username: e.target.value
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            onChange={(e) => setCreds({
                                ...creds,
                                password: e.target.value
                            })}
                        />
                    </div>

                    <button onClick={handleLogin} className="form-button">Login</button>
                </div>
            </div>
        </div>
    );
}