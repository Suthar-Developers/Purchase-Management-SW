import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Still checking authentication
    if (loading) {
        return <PageLoader />;
    }

    // Not logged in
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Logged in
    return <Outlet />;
};

export default ProtectedRoute;