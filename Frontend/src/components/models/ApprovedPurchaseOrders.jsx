import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { fetchApprovedPurchaseOrders } from "../../api/purchaseOrderApi";
import PurchaseOrderForm from "../../components/models/PurchaseOrderForm";
import Button from "../common/Button";

const ApprovedPurchaseOrders = () => {
    const [approvedPOs, setApprovedPOs] = useState([])
    const [selectedPO, setSelectedPO] = useState(null)
    const [isOpenPOForm, setIsOpenPOForm] = useState(false)

    const loadApprovedPO = async () => {
        try {
            const data = await fetchApprovedPurchaseOrders();

            setApprovedPOs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setApprovedPOs([]);
        }
    };

    useEffect(() => {
        loadApprovedPO()
    }, [])

    const openPOViewModel = (po) => {
        setSelectedPO(po)
        setIsOpenPOForm(true)
    }

    const closePOViewModel = () => {
        setIsOpenPOForm(false)
        setSelectedPO(null);
        loadApprovedPO();
    }
    return (
        <div>
            <div className="mx-5 my-3 pb-2 border-b">
                <h1 className="text-base font-bold">Approved Purchase Orders</h1>
            </div>

            <div className="">
                <div className="bg-white h-[90%] rounded-xl p-2">
                    <div className="h-[85%] overflow-auto rounded-t-lg">
                        <table className="w-full">
                            <thead className="bg-[#4b5ea3] text-white text-xs">
                                <tr>
                                    <th className="w-[8%] p-1 text-center">PO No</th>
                                    <th className="w-[8%] p-1 text-center">PO Date</th>
                                    <th className="w-[14%] p-1 text-center">Project</th>
                                    <th className="w-[12%] p-1 text-center">Vendor</th>
                                    <th className="w-[12%] p-1 text-center">Order Placed By</th>
                                    <th className="w-[12%] p-1 text-center">Initiator</th>
                                    <th className="w-[8%] p-1 text-center">Initiator Number</th>
                                    <th className="w-[8%] p-1 text-center">Total Amount</th>
                                    <th className="w-[6%] p-1 text-center">PO Status</th>
                                    <th className="w-[8%] p-1 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvedPOs.length === 0 ? (
                                    <tr>
                                        <td colSpan="12" className="text-center py-6 text-gray-400 text-xs">No drafted PO found</td>
                                    </tr>
                                ) : (
                                    approvedPOs.map((po) => (
                                        <tr className="border border-b-gray-300 border-x-gray-100 text-xs" key={po.po_id}>
                                            <td className="w-[8%] py-3 text-center">{po.po_number}</td>
                                            <td className="w-[8%] py-3 text-center">{po.order_date ? dayjs(po.order_date).format('DD MMM YYYY') : '-'}</td>
                                            <td className="w-[14%] py-3 text-center">{po.projectName}</td>
                                            <td className="w-[12%] py-3 text-center">{po.vendorName}</td>
                                            <td className="w-[12%] py-3 text-center">{po.order_placed_by}</td>
                                            <td className="w-[12%] py-3 text-center">{po.initiator}</td>
                                            <td className="w-[8%] py-3 text-center">{po.initiator_number}</td>
                                            <td className="w-[8%] py-3 text-center">{po.grand_total}</td>
                                            <td className="w-[6%] py-3 text-center">{po.po_status}</td>

                                            <td className="w-[8%] py-3 text-center">
                                            <Button icon={<i className="fa-notdog fa-solid fa-eye fa-lg hover:cursor-pointer"></i>} onClick={() => openPOViewModel(po)} className="text-blue-700 hover:text-green-600 hover:cursor-pointer ml-2 hover:scale-110" />
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
                    onStatusUpdate={loadApprovedPO}
                />
            )}

        </div>
    )
}

export default ApprovedPurchaseOrders
