import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";
import { isRoleAllowed } from "../utils/roles";
import { hasPermission } from "../utils/permissions";

const RoleGuard = ({ roles = [], permission, children }) => {
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

    const hasRole = roles.length === 0 || isRoleAllowed(user?.role, roles);
    const hasRequiredPermission = !permission || hasPermission(user, permission.module, permission.action);

    if (!hasRole || !hasRequiredPermission) {
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
