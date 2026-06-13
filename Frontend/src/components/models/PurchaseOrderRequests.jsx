import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { fetchDraftedPurchaseOrders } from "../../api/purchaseOrderApi";
import PurchaseOrderForm from "../../components/models/PurchaseOrderForm";
import Button from "../common/Button";

const PurchaseOrderRequests = () => {
    const [draftedPOs, setDraftedPOs] = useState([])
    const [selectedPO, setSelectedPO] = useState(null)
    const [isOpenPOForm, setIsOpenPOForm] = useState(false)

    const loadDraftedPO = async () => {
        try {
            const data = await fetchDraftedPurchaseOrders();

            setDraftedPOs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setDraftedPOs([]);
        }
    };

    useEffect(() => {
        loadDraftedPO()
    }, [])

    const openPOViewModel = (po) => {
        setSelectedPO(po)
        setIsOpenPOForm(true)
    }

    const closePOViewModel = () => {
        setIsOpenPOForm(false)
        setSelectedPO(null);
        loadDraftedPO();
    }
    return (
        <div>
            <div className="mx-5 my-3 pb-4 border-b">
                <h1 className="text-base font-bold">Purchase Order Requests for Approval</h1>
            </div>

            <div className="">
                <div className="bg-white h-[90%] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-sm font-bold">Drafted Purchase Orders :-</h2>
                    </div>

                    <div className="h-[85%] overflow-auto rounded-t-lg">
                        <table className="w-full">
                            <thead className="bg-[#4b5ea3] text-white text-xs">
                                <tr>
                                    <th className="w-[8%] p-2 text-center">PO No</th>
                                    <th className="w-[8%] p-2 text-center">PO Date</th>
                                    <th className="w-[14%] p-2 text-center">Project</th>
                                    <th className="w-[12%] p-2 text-center">Vendor</th>
                                    <th className="w-[12%] p-2 text-center">Order Placed By</th>
                                    <th className="w-[12%] p-2 text-center">Initiator</th>
                                    <th className="w-[8%] p-2 text-center">Initiator Number</th>
                                    <th className="w-[8%] p-2 text-center">Total Amount</th>
                                    <th className="w-[6%] p-2 text-center">PO Status</th>
                                    <th className="w-[8%] p-2 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {draftedPOs.length === 0 ? (
                                    <tr>
                                        <td colSpan="12" className="text-center py-6 text-gray-400">
                                            No drafted PO found
                                        </td>
                                    </tr>
                                ) : (
                                    draftedPOs.map((po) => (
                                        <tr className="border border-b-gray-300 border-x-gray-100 text-xs" key={po.po_id}>

                                            <td className="w-[8%] py-3 text-center font-medium">{po.po_number}</td>
                                            <td className="w-[8%] py-3 text-center">{po.order_date ? dayjs(po.order_date).format('DD MMM YYYY') : '-'}</td>
                                            <td className="w-[14%] py-3 text-center">{po.projectName}</td>
                                            <td className="w-[12%] py-3 text-center">{po.vendorName}</td>
                                            <td className="w-[12%] py-3 text-center">{po.order_placed_by}</td>
                                            <td className="w-[12%] py-3 text-center">{po.initiator}</td>
                                            <td className="w-[8%] py-3 text-center">{po.initiator_number}</td>
                                            <td className="w-[8%] py-3 text-center">{po.grand_total}</td>
                                            <td className="w-[6%] py-3 text-center font-medium">{po.po_status}</td>

                                            <td className="w-[8%] py-3 text-center">
                                                <Button icon={<i className="fa-notdog fa-solid fa-eye fa-lg hover:cursor-pointer"></i>} onClick={() => openPOViewModel(po)} className="text-blue-700 hover:text-green-600 ml-2 hover:scale-110" />
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
            {isOpenPOForm && selectedPO && (
                <PurchaseOrderForm
                    mode="view"
                    selectedRequest={selectedPO}
                    poData={selectedPO}
                    onClose={closePOViewModel}
                    onStatusUpdate={loadDraftedPO}
                />
            )}

        </div>
    )
}

export default PurchaseOrderRequests
