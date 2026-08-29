import api, { unwrap } from './http'

export const AddNewMaterial = async (data) => {
    try {
        const res = await api.post("/materials/add-material", data)
        return unwrap(res)
    } catch (error) {
        console.error("Error creating new material", error)
        throw error
    }
}

export const fetchMaterialsList = async () => {
    try {
        const res = await api.get("/materials/material-list")
        return unwrap(res)
    } catch (error) {
        console.error("Error fetching material list", error)
        throw error
    }
}