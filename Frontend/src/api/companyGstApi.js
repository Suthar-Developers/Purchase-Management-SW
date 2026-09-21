import api, { unwrap } from "./http";

export const fetchCompanyGST = async () => {
    try {
        const res = await api.get("/company-gst");

        return unwrap(res);

    } catch (error) {
        console.error(
            "Error fetching company GST details:",
            error.response?.data?.message || error.message
        );

        throw error;
    }
};