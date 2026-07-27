import api, { unwrap } from './http';

export const createNewUser = async (data) => {
    try {
        const res = await api.post('/create-new-user', data)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to create new user", error)
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || error.message || "Failed to create new user"
        }
    }
}

export const getUsers = async () => {
    try {
        const res = await api.get('/users')
        return unwrap(res)
    } catch (error) {
        console.error("Failed to fetch users", error)
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || error.message || "Failed to fetch users"
        }
    }
}
