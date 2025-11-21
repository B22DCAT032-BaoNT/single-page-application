import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "../pages/public/Home.jsx";
import About from "../pages/public/About.jsx";
import NoMatch from "../pages/public/NoMatch.jsx";
import Posts from "../pages/Posts/Posts.jsx";
import PostLists from "../pages/Posts/PostLists.jsx";
import Post from "../pages/Posts/Post.jsx";
import Login from "../pages/public/Login.jsx";
import Stats from "../pages/public/Stats.jsx";

import Countries from "../pages/public/Countries.jsx";
import Profile from "../pages/protected/Profile.jsx";
import ProtectedRoute from "../components/routes/ProtectedRoute.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminProtectedRoute from "../components/routes/AdminProtectedRoute.jsx";
import Register from "../pages/public/Register.jsx";
export default function AppLayout() {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    function logOut() {
        localStorage.removeItem("accessToken");
        setUser(null);
        navigate("/");
    }
    return (
        <>
            <nav className="app-nav">
                <div className="app-nav__container">
                    <div className="app-nav__links">
                        <Link to="/" className="app-nav__link">Home</Link>
                        <Link to="/posts" className="app-nav__link">Posts</Link>
                        <Link to="/about" className="app-nav__link">About</Link>
                        <Link to="/countries" className="app-nav__link">Countries</Link>
                    </div>

                    <div className="app-nav__links">
                        {user?.role === "admin" && (
                            <Link to="/admin" className="app-nav__link">Admin</Link>
                        )}
                        {user && <Link to="/profile" className="app-nav__link">Profile</Link>}
                        {user && <Link to="/stats" className="app-nav__link">Stats</Link>}
                        {!user && <Link to="/auth/login" className="app-nav__link">Login</Link>}
                        {!user && <Link to="/auth/register" className="app-nav__link">Register</Link>}
                        {user && (
                            <button type="button" onClick={logOut} className="app-nav__button">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="app-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/countries" element={<Countries />} />

                    <Route path="/posts" element={<Posts />}>
                        <Route index element={<PostLists user={user} />} />
                        <Route path=":slug" element={<Post user={user} />} />
                    </Route>

                    <Route path="/auth/login" element={<Login onLogin={setUser} />} />
                    <Route path="/auth/register" element={<Register />} />

                    <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
                    <Route path="/stats" element={<ProtectedRoute user={user}><Stats /></ProtectedRoute>} />
                    <Route path="*" element={<NoMatch />} />

                    <Route path="/admin"
                        element={
                            <AdminProtectedRoute user={user}>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        }
                    >
                        <Route path="users" element={<AdminUsers />} />
                    </Route>

                </Routes>
            </div>
        </>
    );
}