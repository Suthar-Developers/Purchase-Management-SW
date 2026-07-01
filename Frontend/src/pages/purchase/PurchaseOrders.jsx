import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { fetchApprovedPR } from "../../api/purchaseOrderApi";
import PurchaseOrderForm from "../../components/models/PurchaseOrderForm";
import PurchaseRequestView from "../../components/models/PurchaseRequestView";
import Button from "../../components/common/Button";

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
        <main className="min-h-full bg-slate-50 px-5 py-5 lg:px-8">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Purchase order creation</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-950">Create Purchase Order</h1>
                    <p className="mt-1 text-sm text-slate-600">Convert approved purchase requests into purchase orders.</p>
                </div>
                <Button
                    lable="Create PO Manually"
                    onClick={() => { setSelectedPR(null); setIsOpenManualPOForm(true); }}
                    className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                    icon={<i className="fa-solid fa-pen-to-square text-xs"></i>}
                />
            </div>

            <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-950">Approved Purchase Requests</h2>
                        <p className="mt-1 text-xs text-slate-500">{approvedPRs.length} request{approvedPRs.length === 1 ? "" : "s"} ready for PO</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">PR No</th>
                                    <th className="px-5 py-3 font-semibold">PR Date</th>
                                    <th className="px-5 py-3 font-semibold">Project</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Deliver Before</th>
                                    <th className="px-5 py-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {approvedPRs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-10 text-center text-sm text-slate-500">No approved requests found</td>
                                    </tr>
                                ) : (
                                    approvedPRs.map((pr) => (
                                        <tr className="hover:bg-slate-50" key={pr.request_id}>
                                            <td className="px-5 py-3 font-semibold text-slate-950">PR-{pr.request_id}</td>
                                            <td className="px-5 py-3 text-slate-600">{pr.created_pr_at ? dayjs(pr.created_pr_at).format('DD MMM YYYY, hh:mm A') : '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{pr.projectName}</td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                                                    {pr.requestStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">{pr.deliverBefore ? dayjs(pr.deliverBefore).format('DD MMM YYYY') : '-'}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        icon={<i className="fa-solid fa-plus"></i>}
                                                        onClick={() => { setSelectedPR(pr); setIsOpenManualPOForm(true); }}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                                        title="Create PO"
                                                    />
                                                    <Button
                                                        onClick={() => openPRViewModel(pr)}
                                                        className="grid h-8 w-8 place-items-center rounded-md border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                                        icon={<i className="fa-solid fa-eye"></i>}
                                                        title="View request"
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
            {isOpenManualPOForm && (
                <PurchaseOrderForm
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

        </main>
    );
};

export default PurchaseOrders;
