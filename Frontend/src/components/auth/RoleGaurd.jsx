import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleGuard = ({ roles = [], children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log("Current User:", user);
    console.log("Allowed Roles:", roles);
    console.log("User Role:", user?.role_id);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    const hasPermission = roles.includes(user.role_id);

    if (!hasPermission) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return children;
};

export default RoleGuard;