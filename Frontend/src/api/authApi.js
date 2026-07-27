import api, { unwrap } from './http';

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials)
        return unwrap(response)
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Login failed"
        );
    }
}

export const refresh = async () => {
    try {
        const response = await api.post("/refresh");

        return unwrap(response);
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Unable to refresh session"
        );
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/logout");

        return unwrap(response);
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Logout failed"
        );
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/me");

        return unwrap(response);
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Unable to load user"
        );
    }
};