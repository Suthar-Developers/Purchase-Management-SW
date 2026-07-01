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
        <main className="min-h-full bg-slate-50 px-5 py-5 lg:px-8">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Released orders</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-950">Approved Purchase Orders</h1>
                    <p className="mt-1 text-sm text-slate-600">View approved and revised purchase orders.</p>
                </div>
                <button
                    type="button"
                    onClick={loadApprovedPO}
                    className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
                    title="Refresh approved purchase orders"
                    aria-label="Refresh approved purchase orders"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-950">Approved PO Register</h2>
                    <p className="mt-1 text-xs text-slate-500">{approvedPOs.length} order{approvedPOs.length === 1 ? "" : "s"} found</p>
                </div>
                <div className="overflow-x-auto">
                        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">PO No</th>
                                    <th className="px-5 py-3 font-semibold">PO Date</th>
                                    <th className="px-5 py-3 font-semibold">Project</th>
                                    <th className="px-5 py-3 font-semibold">Vendor</th>
                                    <th className="px-5 py-3 font-semibold">Order Placed By</th>
                                    <th className="px-5 py-3 font-semibold">Initiator</th>
                                    <th className="px-5 py-3 font-semibold text-right">Total Amount</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {approvedPOs.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-5 py-10 text-center text-sm text-slate-500">No approved PO found</td>
                                    </tr>
                                ) : (
                                    approvedPOs.map((po) => (
                                        <tr className="hover:bg-slate-50" key={po.po_id}>
                                            <td className="px-5 py-3 font-semibold text-slate-950">{po.po_number}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.order_date ? dayjs(po.order_date).format('DD MMM YYYY') : '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.projectName || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.vendorName || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.order_placed_by || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.initiator || "-"}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-slate-950">{Number(po.grand_total || 0).toLocaleString('en-IN')}</td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                                                    {po.po_status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3">
                                                <div className="flex justify-center">
                                                    <Button
                                                        icon={<i className="fa-solid fa-eye"></i>}
                                                        onClick={() => openPOViewModel(po)}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                                        title="View details"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                </div>
            </section>

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

        </main>
    )
}

export default ApprovedPurchaseOrders
