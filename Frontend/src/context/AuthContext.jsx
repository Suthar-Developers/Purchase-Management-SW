import { createContext, useContext, useState, useEffect, useCallback, useMemo, } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* Restore logged-in user */
    const loadUser = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            console.log("User loaded:", response);
            setUser(response.user);
        } catch (error) {
            console.error("Failed to restore session:", error);

            if (error.message === "Unable to refresh session") {
                localStorage.removeItem("accessToken");
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();

        const handleRefresh = () => {
            loadUser();
        };

        window.addEventListener(
            "auth-refreshed",
            handleRefresh
        );

        return () => {
            window.removeEventListener("auth-refreshed", handleRefresh);
        };
    }, [loadUser]);

    const login = useCallback((accessToken, userData) => {
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
    }, []);

    /* Update current user */
    const updateUser = useCallback((updatedUser) => {
        setUser((prev) => ({
            ...prev,
            ...updatedUser,
        }));
    }, []);

    const value = useMemo(() => (
        { user, loading, isAuthenticated: !!user, login, logout, updateUser, refreshUser: loadUser, }
    ), [user, loading, login, logout, updateUser, loadUser,]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};

export default AuthContext;