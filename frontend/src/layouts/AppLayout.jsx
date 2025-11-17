import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import React from "react";
import Home from "../pages/public/Home.jsx";
import About from "../pages/public/About.jsx";
import NoMatch from "../pages/public/NoMatch.jsx";
import Posts from "../pages/posts/Posts.jsx";
import PostLists from "../pages/posts/PostLists.jsx";
import Post from "../pages/posts/Post.jsx";
import Login from "../pages/public/Login.jsx";
import Stats from "../pages/protected/Stats.jsx";
import NewPost from "../pages/protected/NewPost.jsx";
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
    function logOut() { setUser(null); navigate("/"); }
    return (
        <>
            <nav style={{ margin: 10 }}>
                <Link to="/" style={{ padding: 5 }}> Home </Link>
                <Link to="/posts" style={{ padding: 5 }}> Posts </Link>
                <Link to="/about" style={{ padding: 5 }}> About </Link>
                <Link to="/countries" style={{ padding: 5 }}> Countries </Link>

                <span> | </span>
                {user?.role === "admin" && (
                    <>
                        <Link to="/admin" style={{ padding: 5 }}>Admin Panel</Link>
                    </>
                )}
                {user && <Link to="/profile" style={{ padding: 5 }}> My profile</Link>}
                {user && <Link to="/stats" style={{ padding: 5 }}> Stats </Link>}
                {!user && <Link to="/auth/login" style={{ padding: 5 }}> Login </Link>}
                {!user && <Link to="/auth/register" style={{ padding: 5 }}> Register </Link>}
                {user && <Link to="/newpost" style={{ padding: 5 }}> New Post </Link>}
                {user && <button type="button" onClick={logOut} style={{
                    background: 'none', border: 'none', padding: 5, cursor: 'pointer', color: 'blue'
                }}>
                    Logout
                </button>}

            </nav >

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/countries" element={<Countries />} />

                <Route path="/posts" element={<Posts />}>
                    <Route index element={<PostLists />} />
                    <Route path=":slug" element={<Post user={user} />} />
                </Route>

                <Route path="/auth/login" element={<Login onLogin={setUser} />} />
                <Route path="/auth/register" element={<Register />} />

                <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
                <Route path="/stats" element={<ProtectedRoute user={user}><Stats /></ProtectedRoute>} />
                <Route path="/newpost" element={<ProtectedRoute user={user}><NewPost /></ProtectedRoute>} />
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
        </>
    );
}