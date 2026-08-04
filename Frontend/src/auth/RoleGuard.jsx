import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

const RoleGuard = ({ roles = [], children }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Wait until AuthContext finishes loading
    if (loading) {
        return <PageLoader text="Checking permissions..." />;
    }

    // User is not logged in
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // No roles specified = allow access
    if (roles.length === 0) {
        return children;
    }

    const normalizeRole = (role) => String(role ?? '').trim().toLowerCase();
    const currentRole = normalizeRole(user?.role_id);
    const allowedRoles = roles.map(normalizeRole);
    const hasRole = allowedRoles.includes(currentRole) || (allowedRoles.includes('admin') && currentRole === '1');

    if (!hasRole) {
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
