import api, { unwrap } from './http';

export const createNewUser = async (data) => {
    try {
        const res = await api.post('/create-new-user', data)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to create new user", error)
        throw error
    }
}

export const getAllUsers = async () => {
    try {
        const res = await api.get('/users')
        return unwrap(res)
    } catch (error) {
        console.error("Failed to load users", error)
        throw error
    }
}

export const updateUser = async (userId, data) => {
    try {
        const response = await api.put(`/users/${userId}`, data);
        return unwrap(response);
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
};

export const updateUserStatus = async (userId, status) => {
    try {
        const response = await api.patch(`/users/${userId}/status`, { status, });
        return unwrap(response);
    } catch (error) {
        console.error("Failed to update user status:", error);
        throw error;
    }
};

export const resetUserPassword = async (userId, password) => {
    try {
        const response = await api.post(`/users/${userId}/reset-password`, { password, });
        return unwrap(response);
    } catch (error) {
        console.error("Failed to reset user password:", error);
        throw error;
    }
};

export const changeUserPassword = async (userId, newPassword) => {
    try {
        const response = await api.post(`/users/${userId}/change-password`, { newPassword, });
        return unwrap(response);
    } catch (error) {
        console.error("Failed to change user password:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/users/${id}`)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to delete user", error)
        throw error
    }
}