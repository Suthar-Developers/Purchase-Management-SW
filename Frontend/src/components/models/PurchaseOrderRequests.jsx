import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { fetchDraftedPurchaseOrders, updatePOStatus } from "../../api/purchaseOrderApi";
import PurchaseOrderForm from "../../components/models/PurchaseOrderForm";
import Button from "../common/Button";

const PurchaseOrderRequests = () => {
    const [draftedPOs, setDraftedPOs] = useState([])
    const [selectedPO, setSelectedPO] = useState(null)
    const [isOpenPOForm, setIsOpenPOForm] = useState(false)
    const [loadingId, setLoadingId] = useState(null)

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

    const handleStatusUpdate = async (po, poStatus) => {
        const action = poStatus === "Approved" ? "approve" : "reject"
        if (!window.confirm(`Are you sure you want to ${action} ${po.po_number}?`)) return

        try {
            setLoadingId(po.po_id)
            await updatePOStatus(po.po_id, { po_status: poStatus })
            await loadDraftedPO()
        } catch (error) {
            console.error(error)
            alert(error?.response?.data?.message || `Unable to ${action} purchase order`)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <main className="min-h-full bg-slate-50 px-5 py-5 lg:px-8">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Approval queue</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-950">Purchase Order Requests</h1>
                    <p className="mt-1 text-sm text-slate-600">Review drafted purchase orders and take approval action.</p>
                </div>
                <button
                    type="button"
                    onClick={loadDraftedPO}
                    className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
                    title="Refresh purchase order requests"
                    aria-label="Refresh purchase order requests"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">Drafted Purchase Orders</h2>
                        <p className="mt-1 text-xs text-slate-500">{draftedPOs.length} request{draftedPOs.length === 1 ? "" : "s"} waiting</p>
                    </div>
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
                                {draftedPOs.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-5 py-10 text-center text-sm text-slate-500">
                                            No drafted PO found
                                        </td>
                                    </tr>
                                ) : (
                                    draftedPOs.map((po) => (
                                        <tr className="hover:bg-slate-50" key={po.po_id}>

                                            <td className="px-5 py-3 font-semibold text-slate-950">{po.po_number}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.order_date ? dayjs(po.order_date).format('DD MMM YYYY') : '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.projectName || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.vendorName || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.order_placed_by || "-"}</td>
                                            <td className="px-5 py-3 text-slate-600">{po.initiator || "-"}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-slate-950">{Number(po.grand_total || 0).toLocaleString('en-IN')}</td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                                                    {po.po_status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        icon={<i className="fa-solid fa-eye"></i>}
                                                        onClick={() => openPOViewModel(po)}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                                        title="View details"
                                                    />
                                                    <Button
                                                        icon={<i className="fa-solid fa-check"></i>}
                                                        onClick={() => handleStatusUpdate(po, "Approved")}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                                                        disabled={loadingId === po.po_id}
                                                        title="Approve"
                                                    />
                                                    <Button
                                                        icon={<i className="fa-solid fa-xmark"></i>}
                                                        onClick={() => handleStatusUpdate(po, "Rejected")}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                                                        disabled={loadingId === po.po_id}
                                                        title="Reject"
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
                    onStatusUpdate={loadDraftedPO}
                />
            )}

        </main>
    )
}

export default PurchaseOrderRequests
