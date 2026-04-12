import axios from 'axios'

export const fetchApprovedPR = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/approvedPurchaseRequests');

        return res.data

    } catch (error) {
        console.error(error)
    }
}

export const fetchNextPONumber = async () => {
    const res = await axios.get('http://localhost:3000/api/generate-po-number');
    return res.data;
}

export const newPurchaseOrder = async (payload) => {
    try {
        const res = await axios.post('http://localhost:3000/api/new-purchase-order', payload)

        return res.data
    } catch (error) {
        console.error(error);
        return{error: error?.response?.data?.message || "Error while creating purchase order"};
    }
}

export const fetchDraftedPurchaseOrders = async () => {
  const res = await axios.get("http://localhost:3000/api/purchase-orders/drafted-purchase-orders");
  return res.data;
};

export const fetchPurchaseOrderById = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/purchase-orders/${id}`);
    return res.data;
};

export const updatePOStatus = async (id, data) => {
  const res = await axios.put(`http://localhost:3000/api/purchase-orders/${id}/status`, data);
  return res.data;
};