import React, { useState, useEffect, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { fetchVendors } from "../../api/vendorApi"
import { fetchProjects } from "../../api/projectApi"

const PurchaseOrderCreate = ({ selectedRequest, onClose }) => {

    const [vendorList, setVendorList] = useState([])
    const [projectList, setProjectList] = useState([])

    const pdfRef = useRef()

    useEffect(() => {
        fetchVendors().then(res => setVendorList(res.data || res))
        fetchProjects().then(res => setProjectList(res.data || res))
    }, [])

    const approvedMaterials =
        selectedRequest?.materials?.filter(
            (m) => m.materialStatus === "Approved"
        ) || [];

    const [materials, setMaterials] = useState([])

    const [vendor, setVendor] = useState("")
    const [project, setProject] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactPersonNumber, setContactPersonNumber] = useState("")

    const projectData = projectList.find((p) =>
        selectedRequest
            ? p.projectName === selectedRequest.projectName
            : p.project_id === Number(project)
    );

    const [extraCharges, setExtraCharges] = useState({
        extraChargeCategory: "",
        extraChargeAmount: "",
        extraChargeGst: ""
    })

    const [extraCharge, setExtraCharge] = useState(null)
    const [openExtraChargeModel, setOpenExtraChargeModel] = useState(false)

    useEffect(() => {
        if (selectedRequest) {
            setMaterials(
                approvedMaterials.map((m) => ({
                    ...m,
                    rate: "",
                    gst: "",
                    discount: "",
                    total: 0
                }))
            )
        } else {
            setMaterials([
                { material: "", qty: "", rate: "", gst: "", discount: "", total: 0 }
            ])
        }
    }, [selectedRequest])

    // ✅ ROW CALCULATION
    const handleChange = (index, field, value) => {
        const updated = [...materials]
        updated[index][field] = value

        const qty = Number(updated[index].qty || 0)
        const rate = Number(updated[index].rate || 0)
        const discount = Number(updated[index].discount || 0)

        const base = qty * rate
        const discountAmount = (base * discount) / 100

        updated[index].amount = base
        updated[index].discountAmount = discountAmount

        setMaterials(updated)
    }

    const extraBase = Number(extraCharge?.amount || 0)
    const extraGst = Number(extraCharge?.gst || 0)

    const extraGstAmount = (extraBase * extraGst) / 100
    const extraTotal = extraBase + extraGstAmount

    const handleAddRow = () => {
        setMaterials(prev => [...prev, { material: "", qty: "", rate: "", gst: "", discount: "", total: 0 }])
    }

    const handleDeleteRow = (index) => {
        setMaterials(prev => prev.filter((_, i) => i !== index))
    }

    // ✅ TOTALS
    const totals = materials.reduce(
        (acc, m) => {
            const qty = Number(m.qty || 0)
            const rate = Number(m.rate || 0)
            const gst = Number(m.gst || 0)
            const discount = Number(m.discount || 0)

            const amount = qty * rate
            const discountAmount = (amount * discount) / 100
            const taxable = amount - discountAmount
            const gstAmount = (taxable * gst) / 100

            acc.amount += amount
            acc.discount += discountAmount
            acc.subtotal += taxable
            acc.totalGst += gstAmount

            // GST GROUPING
            if (!acc.gstGroups[gst]) {
                acc.gstGroups[gst] = {
                    taxable: 0,
                    gstAmount: 0
                }
            }

            acc.gstGroups[gst].taxable += taxable
            acc.gstGroups[gst].gstAmount += gstAmount

            return acc
        },
        { amount: 0, discount: 0, subtotal: 0, totalGst: 0, gstGroups: {} }
    )

    if (extraCharge) {
        const gst = Number(extraCharge.gst || 0)
        const amount = Number(extraCharge.amount || 0)

        const gstAmount = (amount * gst) / 100

        if (!totals.gstGroups[gst]) {
            totals.gstGroups[gst] = {
                taxable: 0,
                gstAmount: 0
            }
        }

        totals.gstGroups[gst].taxable += amount
        totals.gstGroups[gst].gstAmount += gstAmount

        totals.totalGst += gstAmount
        totals.subtotal += amount // include in taxable
    }

    // ✅ EXTRA CHARGE (MODAL CALCULATION)
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

    // ✅ EXTRA FINAL CALC


    const taxableAmount = totals.subtotal

    const totalGst = totals.totalGst + extraGstAmount
    const cgst = totalGst / 2
    const sgst = totalGst / 2

    const grandTotal = taxableAmount + totalGst

    // 📄 PDF DOWNLOAD
    const downloadPDF = async () => {
        const canvas = await html2canvas(pdfRef.current, {
            onclone: (doc) => {
                const all = doc.querySelectorAll("*")

                all.forEach(el => {
                    const style = window.getComputedStyle(el)

                    // Replace oklch colors with safe fallback
                    if (style.color.includes("oklch")) {
                        el.style.color = "#000"
                    }
                    if (style.backgroundColor.includes("oklch")) {
                        el.style.backgroundColor = "#fff"
                    }
                    if (style.borderColor.includes("oklch")) {
                        el.style.borderColor = "#ccc"
                    }
                })
            }
        })

        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("p", "mm", "a4")
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
        pdf.save("Purchase_Order.pdf")
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[80%] p-6 rounded-xl shadow-xl overflow-auto max-h-[95vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Purchase Order</h2>
                    <button onClick={onClose} className="text-2xl font-bold hover:cursor-pointer">✕</button>
                </div>

                {/* PDF AREA */}
                <div ref={pdfRef} className="p-6 bg-white text-sm">

                    {/* HEADER */}
                    <div className="border-b pb-3 mb-4">
                        <h1 className="text-xl font-bold text-center">JRC INTERIORS</h1>
                        <p className="text-center text-xs">
                            Kanhaiya Industrial Estate, Vasai, Palghar - 401208
                        </p>
                        <p className="text-center text-xs">GSTIN: 27AAGFJ5194C1ZC</p>

                        <h2 className="text-center font-bold text-lg mt-2">
                            PURCHASE ORDER
                        </h2>
                    </div>

                    {/* TOP INFO */}
                    <div className="grid grid-cols-2 mb-4 text-xs">

                        <div className="flex flex-col border">
                            <div>
                                <label className="text-sm text-gray-500 px-2">To</label>
                                <select
                                    name="vendor_id"
                                    className="input-line text-red-500 font-bold"
                                    onChange={(e) => setVendor(e.target.value)}
                                    value={vendor}
                                >
                                    <option value="" disabled>Select Vendor</option>

                                    {vendorList.map((v) => (
                                        <option key={v.vendor_id} value={v.vendor_id}>
                                            {v.vendorName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-2">
                                <p>
                                    {
                                        vendorList.find(
                                            (v) => v.vendor_id === Number(vendor)
                                        )?.location || "N/A"
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex border">


                            <div className="w-[50%] border-r">
                                <div className="border-b">
                                    <p className="font-bold p-1 border-b border-b-gray-400">Purchase Order Number :</p>
                                    <p className="p-1">JRC/PO/001</p>
                                </div>

                                <div className="border-b p-1">
                                    <p className="text-ms font-bold">Contact Person</p>
                                </div>

                                <div className="p-1">
                                    <p className="text-ms font-bold">Contact Person Number</p>
                                </div>
                            </div>

                            <div className="w-[50%]">
                                <div className="flex border-b">
                                    <p className="w-[50%] border-r p-1 font-bold">Dated :</p>
                                    <p className="w-[50%] p-1">{new Date().toLocaleDateString()}</p>
                                </div>

                                <div className="flex border-b">
                                    <p className="w-[50%] border-r p-1 font-bold">Order Placed By :</p>
                                    <p className="w-[50%] p-1">Shyam</p>
                                </div>

                                <div className="border-b p-1">
                                    <input
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                        className="w-3/4 outline-none text-red-500 font-bold"
                                        placeholder="Enter Contact Person Name"
                                    />
                                </div>

                                <div className="p-1">
                                    <input
                                        value={contactPersonNumber}
                                        onChange={(e) => setContactPersonNumber(e.target.value)}
                                        className="w-3/4 outline-none text-red-500 font-bold"
                                        placeholder="Enter Contact Person Name"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* ADDRESS */}
                    <div className="grid grid-cols-2 mb-4 text-xs">

                        <div className="flex flex-col pt-2 border">
                            <div className="border-b">
                                <p className="font-bold px-2">Billing Address :</p>
                                <p className="p-2">JRC Interiors, Unit 107, A To Z Ind. Estate, G.K. Marg, Lower Parel(W), Mumbai, 400013</p>
                            </div>

                            <div className="flex border-b">
                                <p className="border-r w-[15%] font-bold pl-2 py-1">PH :</p>
                                <p className="w-[85%] pl-5 py-1"></p>
                            </div>

                            <div className="flex border-b">
                                <p className="border-r w-[15%] font-bold pl-2 py-1">GSTIN/UIN :</p>
                                <p className="w-[85%] pl-5 py-1 ">27AAGFJ5194C1ZC</p>
                            </div>

                            <div className="flex">
                                <p className="border-r w-[15%] font-bold pl-2 py-1">Email :</p>
                                <p className="w-[85%] pl-5 py-1"></p>
                            </div>

                        </div>



                        <div className="flex flex-col gap-2 pt-2 border">

                            <div className="border-b pb-16.5">
                                <p className="font-bold px-2">Delivery Address</p>
                                <p className="px-2">
                                    {projectData?.address || "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="text-sm font-bold p-1">Project :</p>
                                <p>
                                    {selectedRequest ? (
                                        selectedRequest.projectName
                                    ) : (
                                        <select
                                            name="project_id"
                                            className="w-3/2 outline-none text-red-500 font-bold"
                                            onChange={(e) => setProject(e.target.value)}
                                            value={project}
                                        >
                                            <option value="" disabled>Select Project</option>

                                            {projectList.map((p) => (
                                                <option key={p.project_id} value={p.project_id}>
                                                    {p.projectName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* TABLE */}
                    <table className="w-full border text-sm">

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


                                {!selectedRequest && (
                                    <th className="flex justify-center p-5 items-center">
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </th>
                                )}


                            </tr>
                        </thead>

                        <tbody>
                            {materials.map((m, i) => (
                                <tr key={i} className="border border-b-gray-300 border-x-gray-100">

                                    <td className="py-3 w-[5%] text-center">{i + 1}</td>

                                    <td className="py-3 w-[45%] text-center">
                                        {selectedRequest ? (
                                            m.material
                                        ) : (
                                            <input
                                                placeholder="Enter Material"
                                                className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                onChange={(e) => handleChange(i, "material", e.target.value)}
                                            />
                                        )}
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">
                                        {selectedRequest ? (
                                            m.unit
                                        ) : (
                                            <input
                                                placeholder="Enter Unit"
                                                className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                onChange={(e) => handleChange(i, "unit", e.target.value)}
                                            />
                                        )}
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">
                                        {selectedRequest ? (
                                            m.qty
                                        ) : (
                                            <input
                                                placeholder="Enter Quantity"
                                                className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                                onChange={(e) => handleChange(i, "qty", e.target.value)}
                                            />
                                        )}
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">
                                        <input
                                            placeholder="Enter Rate"
                                            className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                            onChange={(e) => handleChange(i, "rate", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">
                                        <input
                                            placeholder="Enter Discount"
                                            className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                            onChange={(e) => handleChange(i, "discount", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">
                                        <input
                                            placeholder="Enter GST"
                                            className="w-3/4 border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-red-500 font-bold text-center"
                                            onChange={(e) => handleChange(i, "gst", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 w-[8.33%] text-center">₹ {m.amount}</td>


                                    {!selectedRequest && (
                                        <td className="flex justify-center py-5 items-center">
                                            <button
                                                onClick={() => handleDeleteRow(i)}
                                                className="text-red-600 rounded-lg"
                                            >
                                                <i className="fa-solid fa-xmark fa-2xl"></i>
                                            </button>
                                        </td>
                                    )}


                                </tr>
                            ))}
                        </tbody>

                    </table>

                    <div className="flex justify-between mt-4 text-xs">
                        <div className="flex w-full justify-around">
                            {!selectedRequest && (
                                <div className="flex justify-center items-center w-full">
                                    <button
                                        onClick={handleAddRow}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        + Add New Row
                                    </button>
                                </div>
                            )}


                        </div>

                        {/* TOTAL */}

                        <div className="w-72 space-y-2 text-xs">

                            {!extraCharge && (
                                <button
                                    onClick={() => setOpenExtraChargeModel(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                                >
                                    + Add Other Charge
                                </button>
                            )}

                            {/* EXTRA CHARGE DISPLAY */}
                            <div className="flex justify-between mt-3">
                                <span>Total Amount</span>
                                <span>₹ {totals.amount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Total Discount</span>
                                <span>- ₹ {totals.discount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹ {totals.subtotal.toFixed(2)}</span>
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
                                <span>₹ {grandTotal.toFixed(2)}</span>
                            </div>

                        </div>
                    </div>

                    {/* AMOUNT IN WORDS */}
                    <div className="mt-4 text-xs">
                        <p><b>Amount in Words:</b> {grandTotal} Rupees Only</p>
                    </div>

                    <div className="mt-4 text-xs border-t pt-3">

                        <p className="font-bold mb-2">Taxable Value Breakdown:</p>

                        <table className="w-full border text-center text-xs">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-1">Taxable Value</th>
                                    <th className="border p-1">CGST %</th>
                                    <th className="border p-1">CGST Amt</th>
                                    <th className="border p-1">SGST %</th>
                                    <th className="border p-1">SGST Amt</th>
                                    <th className="border p-1">Total GST</th>
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
                                            <td className="border p-1">
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

                                            <td className="border p-1">
                                                ₹ {val.gstAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                            <tfoot>
                                <tr className="font-bold bg-gray-100">
                                    <td className="border p-1">
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
                                    <td className="border p-1">
                                        ₹ {totalGst}
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>

                    {/* TERMS */}
                    <div className="mt-4 text-xs">
                        <p className="font-bold">Terms of Delivery:</p>
                        <ul className="list-disc ml-5">
                            <li>Attach PO copy with invoice</li>
                            <li>Deliver material at site ASAP</li>
                            <li>Mention site name in challan</li>
                        </ul>
                    </div>

                    {/* SIGNATURE */}
                    <div className="grid grid-cols-3 mt-8 text-xs text-center">
                        <div>
                            <p>Prepared By</p>
                            <p className="mt-6">____________</p>
                        </div>

                        <div>
                            <p>Checked By</p>
                            <p className="mt-6">____________</p>
                        </div>

                        <div>
                            <p>Approved By</p>
                            <p className="mt-6">____________</p>
                        </div>
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Download PDF
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>

            </div>

            {openExtraChargeModel && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-[30%] p-6 rounded-xl shadow-xl overflow-auto max-h-[95vh]">
                        <div className="flex justify-end">
                            <button onClick={() => setOpenExtraChargeModel(false)} className="hover:cursor-pointer"><i className="fa-solid text-2xl fa-xmark"></i></button>
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
                            <button onClick={submitExtChargeModel} className="flex items-center justify-center py-2 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-800 hover:cursor-pointer transition">Add Charge</button>
                        </div>

                    </div>
                </div>
            )}

        </div >
    )
}

export default PurchaseOrderCreate