import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authApi"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            setUser(response.user);
        } catch (error) {
            console.error(error);
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    const login = (accessToken, user) => {
        localStorage.setItem("accessToken", accessToken);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser: loadUser,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext; () => useContext(AuthContext);

export default AuthContext;