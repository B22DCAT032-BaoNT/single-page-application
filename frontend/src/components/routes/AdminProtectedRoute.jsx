import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ user, children }) {
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}