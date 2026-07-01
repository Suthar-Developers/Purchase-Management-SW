import api, { unwrap } from './http'

export const fetchVendors = async () => {
    try {
        const res = await api.get("/vendors")

        return unwrap(res)
    } catch (error) {
        console.error("Error to fetch vendors:", error)
        throw error
    }
}

export const updateVendor = async (id, data) => {
    try {
        const res = await api.put(`/vendors/${id}`, data)

        return unwrap(res)
    } catch (error) {
        console.error(
            "Error updating project:",
            error.response?.data?.message || error.message
        )
        throw error
    }
}
