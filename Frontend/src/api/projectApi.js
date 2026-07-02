import axios from 'axios'

export const fetchProjects = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/projects")
        return res.data
    } catch (error) {
        console.error("Error fetching projects", error)
        throw error
    }
}

export const updateProject = async (id, data) => {
    try {
        const res = axios.put(`http://localhost:3000/api/projects/${id}`, data)

        return res.data
    } catch (error) {
        console.error(
            "Error updating project:",
            error.response?.data?.message || error.message
        )
        throw error
    }
}