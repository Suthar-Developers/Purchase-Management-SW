import api, { unwrap } from './http';

export const login = async (data) => {
    try {
        const res = await api.post('/login', data)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to login", error)
        throw {
            status: error.response?.status,
            message: error.response?.data.message || "Login failed"
        }
    }
}