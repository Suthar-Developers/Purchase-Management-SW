import { useState, useEffect } from "react";
import { fetchApprovedPR } from "../../api/purchaseRequestApi";
import PurchaseOrderCreate from "../../components/models/PurchaseOrderCreate";

const PurchaseOrders = () => {

    const [mode, setMode] = useState(null)
    const [approvedPRs, setApprovedPRs] = useState([])
    const [selectedPR, setSelectedPR] = useState(null)

    useEffect(() => {
        if (mode === "auto") {
            fetchApprovedPR().then(setApprovedPRs)
        }
    }, [mode])

    return (
        <div>
            <div className="m-10">
                <h1 className="text-2xl font-bold">Create Purchase Order</h1>
            </div>

            <div className="w-full flex justify-center gap-8 mt-10">

                <button
                    className="flex flex-col items-center justify-center gap-2 
               py-6 px-10 bg-indigo-600 text-white font-semibold rounded-xl 
               shadow-md hover:bg-indigo-700 transition"
                    onClick={() => setMode("manual")} >
                    <i className="fa-solid fa-pen-to-square text-xl"></i>
                    Create PO Manually
                </button>

                <button
                    className="flex flex-col items-center justify-center gap-2 
               py-6 px-10 bg-green-600 text-white font-semibold rounded-xl 
               shadow-md hover:bg-green-700 transition"
                    onClick={() => setMode("auto")} >
                    <i className="fa-solid fa-file-circle-check text-xl"></i>
                    Create PO from Approved Request
                </button>

            </div>

            {/* 🔷 SHOW APPROVED PR LIST */}
            {mode === "auto" && !selectedPR && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">

                        <h2 className="text-lg font-semibold mb-3">Approved Requests</h2>

                        <table className="w-full border">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th>MR No</th>
                                    <th>Project</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvedPRs.map((pr, i) => (
                                    <tr key={i} className="text-center border-t">

                                        <td>MR-{pr.request_id}</td>
                                        <td>{pr.projectName}</td>
                                        <td>{pr.requestStatus}</td>

                                        <td>
                                            <button
                                                onClick={() => setSelectedPR(pr)}
                                                className="text-blue-600"
                                            >
                                                Create PO
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        <div className="flex justify-end gap-3 p-4">
                            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                        </div>

                    </div>
                </div>
            )}

            {/* 🔷 OPEN PO FORM */}
            {selectedPR && (
                <PurchaseOrderCreate
                    selectedRequest={selectedPR}
                    onClose={() => setSelectedPR(null)}
                />
            )}

        </div>
    );
};

export default PurchaseOrders;