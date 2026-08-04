import api, { unwrap } from './http';

export const createNewUser = async (data) => {
    try {
        const res = await api.post('/create-new-user', data)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to create new user", error)
        throw new Error(error.response?.data?.message || error.message || "Failed to create new user")
    }
}

export const getUsers = async () => {
    try {
        const res = await api.get('/users')
        return unwrap(res)
    } catch (error) {
        console.error("Failed to fetch users", error)
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch users")
    }
}

export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/users/${id}`)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to delete user", error)
        throw new Error(error.response?.data?.message || error.message || "Failed to delete user")
    }
}
