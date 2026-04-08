import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { fetchApprovedPR } from "../../api/purchaseOrderApi";
import PurchaseOrderCreate from "../../components/models/PurchaseOrderCreate";
import PurchaseRequestView from "../../components/models/PurchaseRequestView";

const PurchaseOrders = () => {

    const [approvedPRs, setApprovedPRs] = useState([])
    const [selectedPR, setSelectedPR] = useState(null)
    const [isOpenManualPOForm, setIsOpenManualPOForm] = useState(false)
    const [isPRViewModelOpen, setIsPRViewModelOpen] = useState(false)

    const loadApprovedPR = async () => {
        try {
            const res = await fetchApprovedPR();
            setApprovedPRs(res.data || res);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadApprovedPR()
    }, [])

    const openPRViewModel = (pr) => {
        setIsPRViewModelOpen(true)
        setSelectedPR(pr)
    }

    const closePRViewModel = () => {
        setIsPRViewModelOpen(false)
        setSelectedPR(null);
    }

    return (
        <div>
            <div className="mx-5 my-3 pb-4 border-b">
                <h1 className="text-2xl font-bold">Create Purchase Order</h1>
            </div>

            <div className="">
                <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">

                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold">Approved Purchase Requests :-</h2>

                        <button onClick={() => { setSelectedPR(null); setIsOpenManualPOForm(true); }} className="flex items-center justify-center gap-3 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-800 hover:cursor-pointer transition">
                            <i className="fa-solid fa-pen-to-square text-ms"></i>
                            Create PO Manually
                        </button>

                    </div>

                    <div className="h-[85%] overflow-auto rounded-t-lg">

                        <table className="w-full">

                            <thead className="bg-[#4b5ea3] text-white">
                                <tr>
                                    <th className="p-4 text-center">PR No</th>
                                    <th className="p-4 text-center">PR Date</th>
                                    <th className="p-4 text-center">Project</th>
                                    <th className="p-4 text-center">PR Status</th>
                                    <th className="p-4 text-center">Deliver Before</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvedPRs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-400">
                                            No approved requests found
                                        </td>
                                    </tr>
                                ) : (
                                    approvedPRs.map((pr) => (
                                        <tr className="border border-b-gray-300 border-x-gray-100" key={pr.request_id}>

                                            <td className="py-3 text-center">PR-{pr.request_id}</td>
                                            <td className="py-3 text-center">{pr.created_pr_at ? dayjs(pr.created_pr_at).format('DD MMM YYYY, hh:mm A') : '-'}</td>
                                            <td className="py-3 text-center">{pr.projectName}</td>
                                            <td className="py-3 text-center">{pr.requestStatus}</td>
                                            <td className="py-3 text-center">{pr.deliverBefore ? dayjs(pr.deliverBefore).format('DD MMM YYYY') : '-'}</td>

                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => { setSelectedPR(pr); setIsOpenManualPOForm(true); }}
                                                    className="pr-2 font-semibold border-r hover:text-blue-500"
                                                >
                                                    Create PO
                                                </button>

                                                <button
                                                    onClick={() => openPRViewModel(pr)}
                                                    className="text-blue-700 hover:text-green-600 ml-2 hover:scale-110">
                                                    <i className="fa-notdog fa-solid fa-eye fa-lg hover:cursor-pointer"></i>
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>

                    </div>

                </div>
            </div>

            {/* 🔷 OPEN PO FORM */}
            {isOpenManualPOForm && (
                <PurchaseOrderCreate
                    selectedRequest={selectedPR} // can be null (manual)
                    onClose={() => {
                        setIsOpenManualPOForm(false);
                        setSelectedPR(null);
                        loadApprovedPR();
                    }}
                />
            )}

            {isPRViewModelOpen && (
                <PurchaseRequestView req={selectedPR} onClose={closePRViewModel} />
            )}

        </div>
    );
};

export default PurchaseOrders;