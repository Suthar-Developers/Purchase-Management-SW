import api, { unwrap } from './http'

export const fetchProjects = async () => {
    try {
        const res = await api.get("/projects")
        return unwrap(res)
    } catch (error) {
        console.error("Error fetching projects", error)
        throw error
    }
}

export const updateProject = async (id, data) => {
    try {
        const res = await api.put(`/projects/${id}`, data)
        return unwrap(res)
    } catch (error) {
        console.error("Error updating project:", error.response?.data?.message || error.message)
        throw error
    }
}
