import api, { unwrap } from './http'

export const createPurchaseRequest = async (data) => {
    try {
        const res = await api.post("/createPurchaseRequest", data)
        return unwrap(res)
    } catch (error) {
        console.error("Error creating new purchase request", error)
        throw error
    }
}

export const fetchPurchaseRequests = async () => {
    try {
        const res = await api.get("/purchase-requests")
        return unwrap(res)
    } catch (error) {
        console.error("Error fetching purchase request", error)
        throw error
    }
}

export const updateMaterialStatus = async (material_id, materialStatus) => {
    try {
        const res = await api.put("/update-material-status", {material_id, materialStatus})
        return unwrap(res)
    } catch (error) {
        console.error("Error updating material status", error)
        throw error
    }
}

export const updatePRStatus = async (prId, statusData) => {
    try {
        const res = await api.put(`/purchase-requests/${prId}/updatePRStatus`, statusData)
        return unwrap(res)
    } catch (error) {
        console.error("Error updating purchase request status", error)
        throw error
    }
}
