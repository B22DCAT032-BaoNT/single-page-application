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
        <div style={{ padding: 10 }}> <br />
            <span>Username:</span><br />
            <input type="text" onChange={(e) => setCreds({
                ...creds, username:
                    e.target.value
            })} /><br />
            <span>Password:</span><br />
            <input type="password" onChange={(e) => setCreds({
                ...creds, password:
                    e.target.value
            })} /><br />
            <button onClick={handleLogin}>Login</button> </div>
    );
}