import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [creds, setCreds] = useState({});
    const navigate = useNavigate();
    function handleLogin() {
        if (creds?.username === 'admin' && creds?.password === '123') {
            onLogin?.({
                username: creds.username,
                name: creds.name,
                email: creds.email
            });
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
            <span>Name:</span><br />
            <input type="text" onChange={(e) => setCreds({
                ...creds, name:
                    e.target.value
            })} /><br />
            <span>Email:</span><br />
            <input type="text" onChange={(e) => setCreds({
                ...creds, email:
                    e.target.value
            })} /><br /><br />
            <button onClick={handleLogin}>Login</button> </div>
    );
}