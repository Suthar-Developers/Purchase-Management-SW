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

export const loginUser = async (data) => {
    try {
        const res = await api.post('/login-user', data)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to login", error)
        throw {
            status: error.response?.status,
            message: error.response?.data.message || "Login failed"
        }
    }
}