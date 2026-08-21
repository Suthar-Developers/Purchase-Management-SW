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

export const AddNewCategory = async (data) => {
    try {
        const res = await api.post("/materials/add-material-category", data)
        return unwrap(res)
    } catch (error) {
        console.error("Error creating new category", error)
        throw error
    }
}

export const fetchCategoryList = async () => {
    try {
        const res = await api.get("/materials/material-category-list")
        return unwrap(res)
    } catch (error) {
        console.error("Error fetching category list", error)
        throw error
    }
}