import axios from 'axios'

export const createPurchaseRequest = async (data) => {
    try {
        const res = await axios.post("http://localhost:3000/api/createPurchaseRequest", data)
        return res.data
    } catch (error) {
        console.error("Error creating new purchase request", error)
        throw error
    }
}

export const fetchPurchaseRequests = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/purchase-requests")
        return res.data
    } catch (error) {
        console.error("Error fetching purchase request", error)
        throw error
    }
}

export const updateMaterialStatus = async (material_id, materialStatus) => {
    try {
        const res = await axios.put("http://localhost:3000/api/update-material-status", {material_id, materialStatus})
        return res.data
    } catch (error) {
        console.error("Error updating material status", error)
        throw error
    }
}

export const updatePRStatus = async (prId, statusData) => {
    try {
        const res = await axios.put(`http://localhost:3000/api/purchase-requests/${prId}/updatePRStatus`, statusData)
        return res.data
    } catch (error) {
        console.error("Error updating purchase request status", error)
        throw error
    }
}