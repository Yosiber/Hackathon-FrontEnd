import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ requiredRoles }: { requiredRoles: string[] }) => {
    const { authUser, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (authUser === null) {
            navigate("/error/unauthorized");
            return;
        }

        if (requiredRoles.length > 0) {
            const hasRoles = requiredRoles.some((r) => authUser?.role === r);
            if (!hasRoles) {
                navigate("/error/forbidden");
                return;
            }
        }
    }, [authUser, loading, requiredRoles, navigate]);

    if (loading) {
        return null;
    }

    if (authUser === null) {
        return null;
    }

    if (requiredRoles.length > 0) {
        const hasRoles = requiredRoles.some((r) => authUser?.role === r);
        if (!hasRoles) {
            return null;
        }
    }

    return <Outlet />;
}