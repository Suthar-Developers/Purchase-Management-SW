import React, { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { fetchNextPONumber, newPurchaseOrder, updatePOStatus, fetchPurchaseOrderById } from "../../api/purchaseOrderApi"
import { updatePRStatus } from "../../api/purchaseRequestApi"
import { fetchVendors } from "../../api/vendorApi"
import { fetchProjects } from "../../api/projectApi"
import Button from "../common/Button";

const PurchaseOrderForm = ({ mode = "create", selectedRequest, poData, onClose, onStatusUpdate }) => {

    const pdfRef = useRef()

    const [isEditing, setIsEditing] = useState(false);
    const [vendorList, setVendorList] = useState([])
    const [projectList, setProjectList] = useState([])
    const [materials, setMaterials] = useState([])
    const [extraCharge, setExtraCharge] = useState(null)
    const [openExtraChargeModel, setOpenExtraChargeModel] = useState(false)
    const [extraCharges, setExtraCharges] = useState({
        extraChargeCategory: "",
        extraChargeAmount: "",
        extraChargeGst: ""
    })

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        po_number: "Loading...",
        vendor_id: "",
        project_id: "",
        order_date: new Date().toISOString().split('T')[0],
        order_placed_by: "Shyam",
        billing_address: "JRC Interiors, Unit 107, A To Z Ind. Estate, G.K. Marg, Lower Parel(W), Mumbai, 400013",
        delivery_address: "",
        billing_gst: "27AAGFJ5194C1ZC",
        billing_contact_number: "",
        billing_contact_email: "",
        initiator: "",
        initiator_number: "",
        po_status: "Draft"
    });

    // Helper to determine if a field should be read-only or editable
    const isReadOnly = mode === "view" && !isEditing;
    const editable = mode === "create" || isEditing;

    // Handle PO Number Generation (Only for Create Mode)
    useEffect(() => {
        if (mode === "create") {
            fetchNextPONumber().then(res => {
                setForm(prev => ({ ...prev, po_number: res.po_number }));
            });
        }
    }, [mode]);

    useEffect(() => {
        fetchVendors().then(res => setVendorList(res.data || res))
        fetchProjects().then(res => setProjectList(res.data || res))
    }, [])

    // --- Loading existing PO data when in view mode ---
    useEffect(() => {
        if (mode === "view" && poData) {
            if (poData.materials && poData.vendor_id) {
                populateFormWithPOData(poData);
            } else if (poData.po_id || poData.id) {
                setLoading(true);
                const poId = poData.po_id || poData.id;
                fetchPurchaseOrderById(poId).then(fullPO => {
                    populateFormWithPOData(fullPO);
                }).catch(err => console.error("Failed to fetch PO", err)).finally(() => setLoading(false));
            }
        }
    }, [mode, poData]);

    const populateFormWithPOData = (po) => {
        setForm({
            po_number: po.po_number,
            vendor_id: po.vendor_id,
            project_id: po.project_id,
            order_date: po.order_date,
            order_placed_by: po.order_placed_by,
            billing_address: po.billing_address,
            delivery_address: po.delivery_address,
            billing_gst: po.billing_gst,
            billing_contact_number: po.billing_contact_number || "",
            billing_contact_email: po.billing_contact_email || "",
            initiator: po.initiator,
            initiator_number: po.initiator_number,
            po_status: po.po_status
        });

        // Converting material fields to numbers
        const materialsWithNumbers = (po.materials || []).map(m => ({
            ...m,
            qty: Number(m.qty) || 0,
            rate: Number(m.rate) || 0,
            discount: Number(m.discount) || 0,
            gst: Number(m.gst) || 0,
            total: Number(m.total) || 0,
            amount: Number(m.amount) || 0
        }));

        setMaterials(materialsWithNumbers || []);

        setExtraCharge(po.extraCharge ? {
            ...po.extraCharge,
            amount: Number(po.extraCharge.amount) || 0,
            gst: Number(po.extraCharge.gst) || 0
        } : null);
    };

    useEffect(() => {
        if (mode === "create" && selectedRequest?.materials) {
            const approved = selectedRequest.materials
                .filter(m => m.materialStatus === "Approved")
                .map(m => ({
                    material: m.material,
                    unit: m.unit || "",
                    qty: m.qty || 0,
                    rate: "",
                    gst: "",
                    discount: "",
                    total: 0
                }));
            setMaterials(approved);
        } else {
            setMaterials([{ material: "", unit: "", qty: "", rate: "", gst: "", discount: "", total: 0 }]);
        }
    }, [selectedRequest, mode]);

    useEffect(() => {
        if (mode === "create" && selectedRequest && projectList.length > 0 & vendorList.length > 0) {

            const project = projectList.find(
                (p) => p.projectName === selectedRequest.projectName
            );

            const vendor = vendorList.find(
                (v) => v.vendorName === selectedRequest.vendorName
            );

            setForm(prev => ({
                ...prev,
                project_id: project?.project_id || "",
                vendor_id: vendor?.vendor_id || ""
            }));
        }
    }, [selectedRequest, projectList, vendorList, mode]);

    const handleMaterialChange = (index, field, value) => {
        const updated = [...materials]
        updated[index][field] = value

        const qty = Number(updated[index].qty || 0)
        const rate = Number(updated[index].rate || 0)
        const discPercent = Number(updated[index].discount || 0)

        const base = qty * rate
        const discountAmt = (base * discPercent) / 100

        updated[index].total = base - discountAmt
        updated[index].amount = base;

        setMaterials(updated)
    }

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Calculate Totals
    const totals = materials.reduce((acc, m) => {
        const qty = Number(m.qty || 0);
        const rate = Number(m.rate || 0);
        const discPercent = Number(m.discount || 0);
        const gstPercent = Number(m.gst || 0);

        const rowAmount = qty * rate;
        const rowDiscount = (rowAmount * discPercent) / 100;
        const rowTaxable = rowAmount - rowDiscount;
        const rowGstAmt = (rowTaxable * gstPercent) / 100;

        acc.taxable += rowTaxable;
        acc.amount += rowAmount;
        acc.discount += rowDiscount;
        acc.totalGst += rowGstAmt;

        // GST Grouping logic stays the same
        if (gstPercent > 0) {
            if (!acc.gstGroups[gstPercent]) {
                acc.gstGroups[gstPercent] = { taxable: 0, gstAmount: 0 };
            }
            acc.gstGroups[gstPercent].taxable += rowTaxable;
            acc.gstGroups[gstPercent].gstAmount += rowGstAmt;
        }

        return acc;
    }, { amount: 0, discount: 0, subtotal: 0, totalGst: 0, gstGroups: {} });

    // Add Extra Charge to Totals
    const eAmount = Number(extraCharge?.amount || 0);
    const eGstPercent = Number(extraCharge?.gst || 0);
    const eGstAmt = (eAmount * eGstPercent) / 100;

    if (eAmount > 0 && eGstPercent > 0) {
        if (!totals.gstGroups[eGstPercent]) {
            totals.gstGroups[eGstPercent] = { taxable: 0, gstAmount: 0 };
        }
        // Add the extra charge taxable amount and its GST to the grouping
        totals.gstGroups[eGstPercent].taxable += eAmount;
        totals.gstGroups[eGstPercent].gstAmount += eGstAmt;
    }

    const subtotal = totals.amount - totals.discount;
    const taxableAmount = subtotal + eAmount;
    const totalGst = totals.totalGst + eGstAmt;
    const grandTotal = taxableAmount + totalGst;

    // --- Status update handler for Purchase Orders ---
    const handlePOStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus} this PO?`)) return;
        setLoading(true);
        try {
            const poId = poData.po_id || poData.id;
            await updatePOStatus(poId, { po_status: newStatus });
            alert(`PO ${newStatus} successfully`);
            if (onStatusUpdate) onStatusUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReviseClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode !== "create" && !isEditing) return;

        if (!form.project_id) return alert("Please select a project");
        if (!form.vendor_id) return alert("Please select a vendor");
        if (!form.po_number || !form.order_date || !form.order_placed_by)
            return alert("Please fill all required PO details");

        if (materials.length === 0) {
            return alert("Please add at least one material");
        }

        const isValid = materials.every(
            (m) => m.material?.trim() && Number(m.qty) > 0 && Number(m.rate) > 0
        );

        if (!isValid) return alert("Fill all material fields");

        const selectedProject = projectList.find(p => p.project_id === Number(form.project_id));

        const payload = {
            ...form,
            delivery_address: selectedProject?.address || "",
            initiator: selectedProject?.contactPersonName || "",
            initiator_number: selectedProject?.contactPersonNumber || "",
            materials,
            extraCharge,
            total_amount: totals.amount,
            total_discount: totals.discount,
            subtotal: subtotal,
            taxable_amount: taxableAmount,
            total_gst: totalGst,
            grand_total: grandTotal,
            amount_in_words: `${grandTotal.toFixed(2)} Rupees Only`,
            po_status: isEditing ? "Revised" : form.po_status
        };

        try {
            if (isEditing || mode === "edit") {
                // Call your Update API (ensure have this in purchaseOrderApi.js)
                const poId = poData.po_id || poData.id;
                await updatePOStatus(poId, payload);
                alert("PO Revised Successfully!");
            } else {
                const res = await newPurchaseOrder(payload);

                setForm({
                    po_number: "",
                    vendor_id: "",
                    project_id: "",
                    order_date: "",
                    order_placed_by: "",
                    billing_address: "",
                    delivery_address: "",
                    billing_gst: "",
                    billing_contact_number: "",
                    billing_contact_email: "",
                    initiator: "",
                    initiator_number: "",
                    po_status: "Draft",
                });
                setMaterials([]);

                setExtraCharge(null);
                setExtraCharges({
                    extraChargeCategory: "",
                    extraChargeAmount: "",
                    extraChargeGst: ""
                });

                const prId = selectedRequest?.request_id;

                if (prId) {
                    await updatePRStatus(prId, { requestStatus: "PO Drafted" });
                }

                alert(res?.data?.message || res?.message || "PO Created successfully");

                if (onStatusUpdate) onStatusUpdate();
                onClose()
            }
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            alert(error?.response?.data?.message || "Error while creating purchase order");
        } finally {
            setLoading(false);
        }
    };

    const projectData = projectList.find((p) =>
        selectedRequest
            ? p.projectName === selectedRequest.projectName
            : p.project_id === Number(form.project_id)
    );

    // ✅ EXTRA CHARGE (MODAL CALCULATION)
    const extraBase = Number(extraCharge?.amount || 0)
    const modalBase = Number(extraCharges.extraChargeAmount || 0)
    const modalGst = Number(extraCharges.extraChargeGst || 0)

    const extraChargeTotalGst = (modalBase * modalGst) / 100
    const extraChargeTotalAmount = modalBase + extraChargeTotalGst

    const submitExtChargeModel = () => {
        setExtraCharge({
            category: extraCharges.extraChargeCategory,
            amount: modalBase,
            gst: modalGst
        })
        setOpenExtraChargeModel(false)
    }

    const handleAddRow = () => {
        setMaterials(prev => [...prev, { material: "", qty: "", rate: "", gst: "", discount: "", total: 0 }])
    }

    const handleDeleteRow = (index) => {
        setMaterials(prev => prev.filter((_, i) => i !== index))
    }

    const numberToWords = (num) => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const makeWords = (n) => {
            if (n < 20) return a[n];
            let digit = n % 10;
            if (n < 100) return b[Math.floor(n / 10)] + (digit !== 0 ? " " + a[digit] : "");
            if (n < 1000) return a[Math.floor(n / 100)] + "Hundred " + (n % 100 !== 0 ? "and " + makeWords(n % 100) : "");
            return "";
        };

        let n = Math.floor(num);
        if (n === 0) return "Zero";

        let str = "";
        // Crores
        if (Math.floor(n / 10000000) > 0) {
            str += makeWords(Math.floor(n / 10000000)) + "Crore ";
            n %= 10000000;
        }
        // Lakhs
        if (Math.floor(n / 100000) > 0) {
            str += makeWords(Math.floor(n / 100000)) + "Lakh ";
            n %= 100000;
        }
        // Thousands
        if (Math.floor(n / 1000) > 0) {
            str += makeWords(Math.floor(n / 1000)) + "Thousand ";
            n %= 1000;
        }
        // Remaining
        str += makeWords(n);

        return str.trim() + " Rupees Only";
    };

    // ... Creating chunks ...
    const chunkArray = (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    // ... Download PO PDF ...
    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        if (!element) return;

        setLoading(true);

        try {
            // Initialize A4 PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Select all the page divs (mapped by chunkArray)
            const pages = element.querySelectorAll('#po-print-area > div');

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];

                // Hide UI elements in the clone/render
                const hidden = page.querySelectorAll('.no-print, button, i, select');
                hidden.forEach(el => el.style.display = 'none');

                // 1. Capture current page at Scale 2 (Sharp but safe)
                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                });

                // 2. Convert to JPEG (More stable for jsPDF than PNG)
                const imgData = canvas.toDataURL('image/jpeg', 1.0);

                // 3. Add to PDF
                if (i > 0) pdf.addPage();

                // Fill the full A4 page
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                // Restore hidden elements
                hidden.forEach(el => el.style.display = '');
            }

            // 4. Save
            pdf.save(`PO_${form.po_number.replace(/\//g, '-')}.pdf`);

        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Error: Data overflow. Try reducing the number of rows per page.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[80%] p-6 rounded-xl shadow-xl overflow-auto max-h-[95vh]">

                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">{mode === "create" ? "Purchase Order" : "Purchase Order Details"}</h2>
                    <Button lable="✕" onClick={onClose} className="py-1 px-2 rounded-xl text-2xl font-bold hover:bg-gray-100 hover:text-red-700 hover:cursor-pointer" />
                </div>

                <form onSubmit={handleSubmit}>

                    {/* PDF AREA */}
                    <div ref={pdfRef} id="po-print-area" className="py-6 bg-white text-sm">

                        {chunkArray(materials, 17).map((materialChunk, pageIndex, allPages) => (
                            <div
                                key={pageIndex}
                                className="bg-white mb-10 shadow-lg p-8 mx-auto border border-black"
                                style={{ width: '1000px', minHeight: '1120px', position: 'relative' }}>

                                {/* HEADER */}
                                <div className="pb-3">
                                    <div>
                                        <img className="w-[95%] h-18 m-auto" src="/Letter_Head_Logo.jpeg" alt="" />
                                    </div>

                                    <h2 className="text-center font-bold text-lg mt-2">
                                        {form.po_status === "Revised" ? "PURCHASE ORDER (REVISED)" : "PURCHASE ORDER"}
                                    </h2>
                                </div>

                                <div className="border mx-5">

                                    {/* --Top Information-- */}
                                    <div className="grid grid-cols-8 grid-rows-4 mb-1 text-xs">
                                        <div className="col-span-4 border-r border-b pl-1">
                                            <div>
                                                <label className="text-sm text-gray-500">To</label>
                                                {editable ? (
                                                    <select
                                                        name="vendor_id"
                                                        className="input-line text-red-500 font-bold"
                                                        onChange={handleFormChange}
                                                        value={form.vendor_id || ""}
                                                    >
                                                        <option value="" disabled>Select Vendor</option>
                                                        {vendorList.map((v) => (
                                                            <option key={v.vendor_id} value={v.vendor_id}>
                                                                {v.vendorName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p className="font-bold text-gray-800 px-2">
                                                        {vendorList.find(v => v.vendor_id === Number(form.vendor_id))?.vendorName || 'N/A'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-2 col-start-5 border-b flex flex-col justify-evenly">
                                            <p className="pl-1 font-bold border-b border-b-gray-400">Purchase Order Number :</p>
                                            <p className="pl-1">{form.po_number}</p>
                                        </div>

                                        <div className="col-start-7 border-b border-x flex flex-col justify-evenly">
                                            <p className="pl-1 font-bold border-b border-b-gray-400">Dated :</p>
                                            <p className="pl-1 font-bold">Order Placed By :</p>
                                        </div>

                                        <div className="col-start-8 border-b flex flex-col justify-evenly">
                                            <p className="pl-1 border-b border-b-gray-400">{new Date().toLocaleDateString()}</p>
                                            <p className="pl-1">Shyam</p>
                                        </div>

                                        <div className="col-span-4 row-start-2 border-r">
                                            <div className="m-1">
                                                <p>
                                                    {vendorList.find(
                                                        (v) => v.vendor_id === Number(form.vendor_id || "")
                                                    )?.location || "N/A"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 col-start-5 row-start-2 flex flex-col justify-evenly">
                                            <p className="pl-1 text-ms font-bold border-b border-b-gray-400">Contact Person</p>
                                            <p className="pl-1 text-ms font-bold">Contact Person Number</p>
                                        </div>

                                        <div className="col-span-2 col-start-7 row-start-2 border-l flex flex-col justify-evenly">
                                            <p className="pl-1 border-b border-b-gray-400">{projectData?.contactPersonName || "N/A"}</p>
                                            <p className="pl-1">{projectData?.contactPersonNumber || "N/A"}</p>
                                        </div>

                                        <div className="col-span-4 row-start-3 border-y border-r">
                                            <div className="pl-1">
                                                <p className="font-bold">Billing Address :</p>
                                                <p>JRC Interiors, Unit 107, A To Z Ind. Estate, G.K. Marg, Lower Parel(W), Mumbai, 400013</p>
                                            </div>
                                        </div>

                                        <div className="col-span-4 col-start-5 row-start-3 border-y">
                                            <div className="pl-1">
                                                <p className="font-bold">Delivery Address :</p>
                                                <p>{projectData?.address || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="row-start-4 border-r">
                                            <p className="pl-1 border-b font-bold">PH :</p>
                                            <p className="pl-1 border-b font-bold">GSTIN/UIN :</p>
                                            <p className="pl-1 border-b font-bold">Email :</p>
                                        </div>

                                        <div className="col-span-3 row-start-4 border-r">
                                            <p className="pl-2 border-b">-</p>
                                            <p className="pl-2 border-b">27AAGFJ5194C1ZC</p>
                                            <p className="pl-2 border-b">-</p>
                                        </div>

                                        <div className="col-span-4 col-start-5 row-start-4 border-b flex items-center">
                                            <div className="flex items-center gap-1 pl-1">
                                                <p className="text-sm font-bold">Project :</p>
                                                <div>
                                                    {(isReadOnly || selectedRequest) ? (
                                                        <p className="font-bold text-gray-800">
                                                            {projectData?.projectName || 'N/A'}
                                                        </p>
                                                    ) : (
                                                        <select
                                                            name="project_id"
                                                            className="w-3/2 outline-none text-red-500 font-bold"
                                                            onChange={handleFormChange}
                                                            value={form.project_id || ""}
                                                        >
                                                            <option value="" disabled>Select Project</option>
                                                            {projectList.map((p) => (
                                                                <option key={p.project_id} value={p.project_id}>
                                                                    {p.projectName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Material Table */}
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border p-2">S.No</th>
                                                <th className="border p-2">Description</th>
                                                <th className="border p-2">Unit</th>
                                                <th className="border p-2">Qty</th>
                                                <th className="border p-2">Rate</th>
                                                <th className="border p-2">Disc %</th>
                                                <th className="border p-2">GST %</th>
                                                <th className="border p-2">Amount</th>

                                                {!selectedRequest && !isReadOnly && (
                                                    <th className="flex justify-center p-5 items-center">
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </th>
                                                )}

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {materialChunk.map((m, i) => (
                                                <tr key={i} className="border border-b-gray-300 border-r-gray-100">

                                                    <td className="w-[5%] text-center">{(pageIndex * 17) + i + 1}</td>

                                                    <td className="w-[46.3%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter Material"
                                                                className="w-3/4 border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "material", e.target.value)}
                                                                value={m.material}
                                                            />
                                                        ) : (
                                                            <span>{m.material}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter Unit"
                                                                className="w-full border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "unit", e.target.value)}
                                                                value={m.unit}
                                                            />
                                                        ) : (
                                                            <span>{m.unit}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter Quantity"
                                                                className="w-full border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "qty", e.target.value)}
                                                                value={m.qty}
                                                            />
                                                        ) : (
                                                            <span>{m.qty}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter Rate"
                                                                className="w-full border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "rate", e.target.value)}
                                                                disabled={isReadOnly}
                                                                value={m.rate}
                                                            />
                                                        ) : (
                                                            <span>{m.rate}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter Discount"
                                                                className="w-full border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "discount", e.target.value)}
                                                                disabled={isReadOnly}
                                                                value={m.discount}
                                                            />
                                                        ) : (
                                                            <span>{m.discount}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">
                                                        {editable ? (
                                                            <input
                                                                placeholder="Enter GST"
                                                                className="w-full border-b border-gray-400 p-1 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                                onChange={(e) => handleMaterialChange(i, "gst", e.target.value)}
                                                                disabled={isReadOnly}
                                                                value={m.gst}
                                                            />
                                                        ) : (
                                                            <span>{m.gst}</span>
                                                        )}
                                                    </td>

                                                    <td className="w-[8.33%] text-center">₹ {((Number(m.qty)) * ((Number(m.rate))) || 0).toFixed(2)}</td>

                                                    {!selectedRequest && !isReadOnly && (
                                                        <td className="border-none">
                                                            <Button onClick={() => handleDeleteRow(i)} className="text-red-600 rounded-lg hover:cursor-pointer" icon={<i className="fa-solid fa-xmark fa-2xl"></i>} />
                                                        </td>
                                                    )}

                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>

                                    {/* Calculation Part */}
                                    {pageIndex === allPages.length - 1 && (
                                        <div>
                                            <div className="flex flex-col justify-between mt-4 text-xs">
                                                <div className="flex w-full justify-around">
                                                    {!selectedRequest && !isReadOnly && (
                                                        <div className="flex justify-center items-center w-full">
                                                            <Button lable="+ Add New Row" type="button" onClick={handleAddRow} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer" />
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="flex justify-end pr-5">
                                                    <div className="w-72 space-y-1 p-2 text-xs">

                                                        {!extraCharge && !isReadOnly && (
                                                            <Button lable="+ Add Other Charge" type="button" onClick={() => setOpenExtraChargeModel(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 hover:cursor-pointer" />
                                                        )}

                                                        <div className="flex justify-between">
                                                            <span>Total Amount</span>
                                                            <span>₹ {subtotal.toFixed(2)}</span>
                                                        </div>

                                                        {extraCharge && (
                                                            <div className="flex justify-between">
                                                                <span>{extraCharge.category}</span>
                                                                <span>₹ {extraBase.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between">
                                                            <span>Taxable Amount</span>
                                                            <span>₹ {taxableAmount.toFixed(2)}</span>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <span>CGST</span>
                                                            <span>₹ {(totalGst / 2).toFixed(2)}</span>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <span>SGST</span>
                                                            <span>₹ {(totalGst / 2).toFixed(2)}</span>
                                                        </div>

                                                        <div className="flex justify-between font-bold border-t pt-2 text-sm">
                                                            <span>Total</span>
                                                            <span>₹ {grandTotal}</span>
                                                        </div>
                                                    </div>

                                                </div>


                                                {/* AMOUNT IN WORDS */}
                                                <div className="mt-4 text-xs px-3">
                                                    <p>Chargeable Amount in Words :</p>
                                                    <p><b>{numberToWords(grandTotal)}</b></p>
                                                </div>

                                                {/* Taxable Value Breakdown */}
                                                <div className="mt-4 text-xs border-t pt-3">
                                                    {Object.keys(totals.gstGroups).length > 0 ? (
                                                        <>
                                                            <p className="font-bold mb-2 px-3">Taxable Value Breakdown:</p>

                                                            <table className="w-full text-center text-xs">
                                                                <thead>
                                                                    <tr className="bg-gray-200">
                                                                        <th className="border-y p-1">Taxable Value</th>
                                                                        <th className="border p-1">CGST %</th>
                                                                        <th className="border p-1">CGST Amt</th>
                                                                        <th className="border p-1">SGST %</th>
                                                                        <th className="border p-1">SGST Amt</th>
                                                                        <th className="border-y p-1">Total GST</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {Object.entries(totals.gstGroups).map(([gst, val], i) => {
                                                                        const cgstRate = Number(gst) / 2
                                                                        const sgstRate = Number(gst) / 2

                                                                        const cgstAmt = val.gstAmount / 2
                                                                        const sgstAmt = val.gstAmount / 2

                                                                        return (
                                                                            <tr key={i}>
                                                                                <td className="border-y p-1">
                                                                                    ₹ {val.taxable.toFixed(2)}
                                                                                </td>

                                                                                <td className="border p-1">
                                                                                    {cgstRate}%
                                                                                </td>

                                                                                <td className="border p-1">
                                                                                    ₹ {cgstAmt.toFixed(2)}
                                                                                </td>

                                                                                <td className="border p-1">
                                                                                    {sgstRate}%
                                                                                </td>

                                                                                <td className="border p-1">
                                                                                    ₹ {sgstAmt.toFixed(2)}
                                                                                </td>

                                                                                <td className="border-y p-1">
                                                                                    ₹ {val.gstAmount.toFixed(2)}
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>

                                                                <tfoot>
                                                                    <tr className="font-bold bg-gray-100">
                                                                        <td className="border-y p-1">
                                                                            ₹ {taxableAmount.toFixed(2)}
                                                                        </td>
                                                                        <td className="border p-1">—</td>
                                                                        <td className="border p-1">
                                                                            ₹ {(totalGst / 2).toFixed(2)}
                                                                        </td>
                                                                        <td className="border p-1">—</td>
                                                                        <td className="border p-1">
                                                                            ₹ {(totalGst / 2).toFixed(2)}
                                                                        </td>
                                                                        <td className="border-y p-1">
                                                                            ₹ {totalGst}
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>

                                                            </table>
                                                        </>
                                                    ) : (
                                                        <p className="italic px-3 text-gray-500">No GST applicable for this order.</p>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Terms & Conditions */}

                                            <div className="absolute bottom-10 left-8 right-8">
                                                <div className="mb-4 font-bold text-blue-900 text-xs px-3 italic">
                                                    NOTE : REQUIRED MTC REPORT
                                                </div>

                                                <div className="px-3 text-xs">
                                                    <p className="font-bold">Terms of Delivery:</p>
                                                    <ul className="list-decimal ml-5">
                                                        <li>Please attached PO Copy & Site Sign challan copy along with the invoice & kindly mentioned our GST in your invoice.</li>
                                                        <li>Please deliver above material at above given site address asap.</li>
                                                        <li>Kindly mention proper site name and address in your challan.</li>
                                                        <li>E-way Bill Applicable.</li>
                                                    </ul>
                                                </div>

                                                {/* SIGNATURE */}
                                                <div className="grid grid-cols-3 text-xs text-center border-t pt-4">
                                                    <div>
                                                        <p>Prepared By</p>
                                                        <p className="mt-6">____________________</p>
                                                    </div>

                                                    <div>
                                                        <p>Checked By</p>
                                                        <p className="mt-6">____________________</p>
                                                    </div>

                                                    <div>
                                                        <p>Approved By</p>
                                                        <p className="mt-6">____________________</p>
                                                    </div>
                                                </div>

                                                <div className="text-center text-[10px] text-gray-400 mt-2">
                                                    <p>This is a Computer Generated Purchase Order</p>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 mt-4 no-print">
                            {mode === "view" && !isEditing && (
                                <>
                                    <Button lable={loading ? "Generating..." : "Download PDF"} icon={<i className="fa-solid fa-download"></i>} type="button" onClick={handleDownloadPDF} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer hover:bg-blue-700" disabled={loading} />
                                    {form.po_status === "Approved" && (
                                        <Button lable="Revise PO" type="button" onClick={handleReviseClick} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 hover:cursor-pointer" />
                                    )}
                                </>
                            )}

                            {(mode === "create" || isEditing) ? (
                                <Button lable={isEditing ? "Save Revision" : "Create PO"} type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-green-700" />
                            ) : (
                                <>
                                    {form.po_status !== "Approved" && form.po_status !== "Revised" && (
                                        <>
                                            <Button lable="Approve" type="button" onClick={() => handlePOStatusUpdate("Approved")} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-green-700" disabled={loading || form.po_status === "Approved"} />

                                            <Button lable="Reject" type="button" onClick={() => handlePOStatusUpdate("Rejected")} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-red-700" disabled={loading || form.po_status === "Rejected"} />

                                            <Button lable="Hold" type="button" onClick={() => handlePOStatusUpdate("Hold")} className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-yellow-700" disabled={loading || form.po_status === "Hold"} />
                                        </>
                                    )}
                                </>
                            )}

                            <Button lable="Close" type="button" onClick={onClose} className="bg-gray-200 font-semibold px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-300" />
                        </div>
                    </div>
                </form>
            </div >

            {openExtraChargeModel && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-[30%] p-6 rounded-xl shadow-xl overflow-auto max-h-[95vh]">
                        <div className="flex justify-end">
                            <Button icon={<i className="fa-solid text-2xl fa-xmark"></i>} onClick={() => setOpenExtraChargeModel(false)} className="px-2 py-1 rounded-lg hover:bg-gray-100 hover:text-red-700 hover:cursor-pointer" />
                        </div>
                        <h2 className="text-center font-bold mb-10">Add Extra Charge</h2>

                        <div className="flex justify-between mb-5 px-15">
                            <label className="font-bold">Charge Category</label>
                            <select name="extraChargeCategory" onChange={(e) => setExtraCharges({ ...extraCharges, extraChargeCategory: e.target.value })} >
                                <option value="">Select Category</option>
                                <option name="Transport" value="Transport">Transport</option>
                                <option name="Cartage" value="Cartage">Cartage</option>
                                <option name="Loading/Shifting" value="Loading/Shifting">Loading/Shifting</option>
                                <option name="Freight Charge" value="Freight Charge">Freight Charge</option>
                                <option name="Other" value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex justify-between mb-5 px-15">
                            <label className="font-bold">Charge Amount</label>
                            <input
                                type="text"
                                name="extraChargeAmount"
                                value={extraCharges.extraChargeAmount}
                                onChange={(e) => setExtraCharges({ ...extraCharges, extraChargeAmount: e.target.value })}
                                className="w-3/7 border-b border-gray-600 outline-none hover:border-gray-600 text-center"
                            />
                        </div>

                        <div className="flex justify-between mb-5 px-15">
                            <label className="font-bold">GST %</label>
                            <input
                                type="text"
                                name="extraChargeGst"
                                value={extraCharges.extraChargeGst}
                                onChange={(e) => setExtraCharges({ ...extraCharges, extraChargeGst: e.target.value })}
                                className="w-3/7 border-b border-gray-600 outline-none hover:border-gray-600 text-center"
                            />
                        </div>

                        <div className="flex justify-around px-15 py-6">
                            <label className="font-bold pt-1">GST Amount</label>
                            <p className="pt-1">₹ {extraChargeTotalGst.toFixed(2)}</p>
                        </div>

                        <div className="flex justify-around mb-5 px-15">
                            <label className="font-bold pt-1">Total Amount</label>
                            <p className="pt-1">₹ {extraChargeTotalAmount.toFixed(2)}</p>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={submitExtChargeModel} className="flex items-center justify-center py-2 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-800 hover:cursor-pointer transition">Add Charge</button>
                        </div>

                    </div>
                </div>
            )}
        </div >
    )
}

export default PurchaseOrderForm