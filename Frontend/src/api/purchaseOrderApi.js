import axios from 'axios'

export const fetchApprovedPR = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/approvedPurchaseRequests');

        return res.data

    } catch (error) {
        console.error(error)
    }
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