import api, { unwrap } from './http'

export const fetchApprovedPR = async () => {
    try {
        const res = await api.get('/approvedPurchaseRequests')
        return unwrap(res)
    } catch (error) {
        console.error(error)
        return []
    }
}

export const fetchNextPONumber = async () => {
    const res = await api.get('/generate-po-number')
    return unwrap(res)
}

export const newPurchaseOrder = async (payload) => {
    try {
        const res = await api.post('/new-purchase-order', payload)
        return unwrap(res)
    } catch (error) {
        console.error(error)
        return { error: error?.response?.data?.message || "Error while creating purchase order" }
    }
}

export const fetchDraftedPurchaseOrders = async () => {
  const res = await api.get("/purchase-orders/drafted-purchase-orders")
  return unwrap(res)
}

export const fetchApprovedPurchaseOrders = async () => {
  const res = await api.get("/purchase-orders/approved-purchase-orders")
  return unwrap(res)
}

export const fetchPurchaseOrderById = async (id) => {
    const res = await api.get(`/purchase-orders/${id}`)
    return unwrap(res)
}

export const updatePOStatus = async (id, data) => {
  const res = await api.put(`/purchase-orders/${id}/updatePOStatus`, data)
  return unwrap(res)
}
