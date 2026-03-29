import { useState, useEffect } from "react";
import { fetchApprovedPR } from "../../api/purchaseOrderApi";
import PurchaseOrderCreate from "../../components/models/PurchaseOrderCreate";

const PurchaseOrders = () => {

    const [approvedPRs, setApprovedPRs] = useState([])
    const [selectedPR, setSelectedPR] = useState(null)
    const [isOpenApprovedPRs, setIsOpenApprovedPRs] = useState(false)

    const handleAutoClick = async () => {
        try {
            const res = await fetchApprovedPR();
            setApprovedPRs(res.data || res);
            setIsOpenApprovedPRs(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeApprovedPRs = () => {
        setIsOpenApprovedPRs(false)
    }

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
                >
                    <i className="fa-solid fa-pen-to-square text-xl"></i>
                    Create PO Manually
                </button>

                <button
                    className="flex flex-col items-center justify-center gap-2 
               py-6 px-10 bg-green-600 text-white font-semibold rounded-xl 
               shadow-md hover:bg-green-700 transition"
                    onClick={handleAutoClick} >
                    <i className="fa-solid fa-file-circle-check text-xl"></i>
                    Create PO from Approved Request
                </button>

            </div>

            {/* 🔷 SHOW APPROVED PR LIST */}

            {isOpenApprovedPRs === true && !selectedPR && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">

                        <div className="flex justify-between mb-5">
                            <h2 className="text-lg font-bold mb-3">Approved Requests :-</h2>
                            <button onClick={closeApprovedPRs} className="font-medium text-2xl mx-5 py-1 px-3 rounded-4xl hover:cursor-pointer hover:bg-gray-200">X</button>
                        </div>

                        <div className="h-[85%]">

                            <table className="w-full border">

                                <thead className="bg-[#4b5ea3] text-white">
                                    <tr>
                                        <th className="p-4 text-center">MR No</th>
                                        <th className="p-4 text-center">Project</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {approvedPRs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6 text-gray-400">
                                                No approved requests found
                                            </td>
                                        </tr>
                                    ) : (
                                        approvedPRs.map((pr, index) => (
                                            <tr className="border border-b-gray-300 border-x-gray-100" key={index}>

                                                <td className="py-3 text-center">MR-{pr.request_id}</td>
                                                <td className="py-3 text-center">{pr.projectName}</td>
                                                <td className="py-3 text-center">{pr.requestStatus}</td>

                                                <td className="py-3 text-center">
                                                    <button
                                                        onClick={() => { setSelectedPR(pr); setIsOpenApprovedPRs(false); }}
                                                        className="pr-2 font-semibold border-r hover:text-blue-500"
                                                    >
                                                        Create PO
                                                    </button>

                                                    <button
                                                        onClick={() => openView(req)}
                                                        className="text-blue-700 hover:text-green-600 ml-2 hover:scale-120">
                                                        <i className="fa-notdog fa-solid fa-eye fa-lg hover:cursor-pointer"></i>
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>

                        </div>

                        <div className="flex justify-end gap-3 p-4">
                            <button onClick={closeApprovedPRs} className="px-6 py-2 bg-gray-200 font-medium rounded-lg hover:bg-gray-300">Cancel</button>
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