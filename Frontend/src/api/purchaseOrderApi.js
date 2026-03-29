import axios from 'axios'

export const fetchApprovedPR = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/approvedPurchaseRequests');

        return res.data

    } catch (error) {
        console.error(error)
    }
}