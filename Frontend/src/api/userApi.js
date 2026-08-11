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

export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/users/${id}`)
        return unwrap(res)
    } catch (error) {
        console.error("Failed to delete user", error)
        throw error
    }
}
