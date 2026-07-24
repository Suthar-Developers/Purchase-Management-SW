import api, { unwrap } from './http';

export const createNewUser = async (data) => {
    try {
        const res = await api.post('/create-new-user', data)
        return unwrap(res)
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to create user"
        );
    }
}