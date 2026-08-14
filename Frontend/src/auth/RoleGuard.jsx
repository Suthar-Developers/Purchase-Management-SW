import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";
import { isRoleAllowed } from "../utils/roles";

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

    // Uses the shared role helper so id 1 and name "Admin" are treated the same.
    const hasRole = isRoleAllowed(user?.role, roles);

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
