import axios from 'axios'

export const fetchVendors = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/vendors")

        return res.data
    } catch (error) {
        console.error("Error to fetch vendors:", error)
        throw error
    }
}

export const updateVendor = async (id, data) => {
    try {
        const res = await axios.put(`http://localhost:3000/api/vendors/${id}`, data)

        return res.data
    } catch (error) {
        console.error(
            "Error updating project:",
            error.response?.data?.message || error.message
        )
        throw error
    }
}