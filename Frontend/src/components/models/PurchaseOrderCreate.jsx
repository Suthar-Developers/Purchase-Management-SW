import React, { useState, useEffect, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { fetchVendors } from "../../api/vendorApi"
import { fetchProjects } from "../../api/projectApi"

const PurchaseOrderCreate = ({ selectedRequest, onClose }) => {

    const [vendorList, setVendorList] = useState([])
    const [projectList, setProjectList] = useState([])

    const pdfRef = useRef()

    const getVendors = async () => {
        try {
            const data = await fetchVendors();
            setVendorList(data.data || data);
        } catch (error) {
            console.error(error)
        }
    }

    const getProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjectList(data.data || data);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getVendors()
        getProjects()
    }, [])

    const approvedMaterials =
        selectedRequest?.materials?.filter(
            (m) => m.materialStatus === "Approved"
        ) || [];

    const [materials, setMaterials] = useState([])

    const [vendor, setVendor] = useState("")
    const [project, setProject] = useState("")
    const [contactPerson, setContactPerson] = useState("")

    const handleAddRow = () => {
        setMaterials((prev) => [
            ...prev,
            {
                material: "",
                qty: "",
                rate: "",
                gst: "",
                discount: "",
                total: 0
            }
        ]);
    };

    const handleDeleteRow = (index) => {
        setMaterials((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (selectedRequest) {
            const formatted = approvedMaterials.map((m) => ({
                ...m,
                rate: "",
                gst: "",
                discount: "",
                total: 0
            }));

            setMaterials(formatted);
        } else {
            setMaterials([
                {
                    material: "",
                    qty: "",
                    rate: "",
                    gst: "",
                    discount: "",
                    total: 0
                }
            ]);
        }
    }, [selectedRequest]);

    // 🧮 CALCULATION
    const handleChange = (index, field, value) => {
        const updated = [...materials]

        updated[index][field] = value

        const qty = Number(updated[index].qty || 0)
        const rate = Number(updated[index].rate || 0)
        const gst = Number(updated[index].gst || 0)
        const discount = Number(updated[index].discount || 0)

        let total = qty * rate

        const discountAmount = (total * discount) / 100
        const gstAmount = (total * gst) / 100
        total -= discountAmount
        total += gstAmount

        updated[index].total = total

        setMaterials(updated)
    }

    // TOTALS
    const subtotal = materials.reduce((sum, m) => sum + (m.qty * (m.rate || 0)), 0)
    const gstTotal = materials.reduce((sum, m) => sum + ((m.qty * (m.rate || 0) * (m.gst || 0)) / 100), 0)
    const discountTotal = materials.reduce((sum, m) => sum + ((m.qty * (m.rate || 0) * (m.discount || 0)) / 100), 0)

    const grandTotal = subtotal + gstTotal - discountTotal

    // 📄 PDF DOWNLOAD
    const downloadPDF = async () => {
        const canvas = await html2canvas(pdfRef.current)
        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("p", "mm", "a4")
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
        pdf.save("Purchase_Order.pdf")
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[85%] p-6 rounded-xl shadow-xl overflow-auto max-h-[95vh]">

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Purchase Order</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* PDF AREA */}
                <div ref={pdfRef} className="p-4 bg-white">

                    {/* COMPANY */}
                    <div className="text-center border-b pb-2 mb-4">
                        <h1 className="text-xl font-bold">JRC Interiors</h1>
                        <p className="text-sm text-gray-500">Purchase Order</p>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-3 gap-4 mb-4">

                        <div>
                            <p className="text-sm text-gray-500">Project</p>
                            {selectedRequest ? (
                                selectedRequest.projectName
                            ) : (
                                <select
                                    name="project_id"
                                    className="input-line"
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
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Vendors</label>
                            <select
                                name="vendor_id"
                                className="input-line"
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

                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <input
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                className="input-line"
                            />
                        </div>

                    </div>

                    {/* TABLE */}
                    <table className="w-full text-sm">

                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-center">Material</th>
                                <th className="p-4 text-center">Qty</th>
                                <th className="p-4 text-center">Rate</th>
                                <th className="p-4 text-center">GST %</th>
                                <th className="p-4 text-center">Discount</th>
                                <th className="p-4 text-center">Total</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {materials.map((m, i) => (
                                <tr key={i} className="border border-b-gray-300 border-x-gray-100">

                                    <td className="py-3 text-center">
                                        {selectedRequest ? (
                                            m.material
                                        ) : (
                                            <input
                                                placeholder="Enter Material"
                                                className="border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-center"
                                                onChange={(e) => handleChange(i, "material", e.target.value)}
                                            />
                                        )}
                                    </td>

                                    <td className="py-3 text-center">
                                        {selectedRequest ? (
                                            m.qty
                                        ) : (
                                            <input
                                                placeholder="Enter Quantity"
                                                className="border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-center"
                                                onChange={(e) => handleChange(i, "qty", e.target.value)}
                                            />
                                        )}
                                    </td>

                                    <td className="py-3 text-center">
                                        <input
                                            placeholder="Enter Rate"
                                            className="border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-center"
                                            onChange={(e) => handleChange(i, "rate", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 text-center">
                                        <input
                                            placeholder="Enter GST"
                                            className="border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-center"
                                            onChange={(e) => handleChange(i, "gst", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 text-center">
                                        <input
                                            placeholder="Enter Discount"
                                            className="border-b border-gray-400 p-2 outline-none hover:border-gray-600 text-center"
                                            onChange={(e) => handleChange(i, "discount", e.target.value)}
                                        />
                                    </td>

                                    <td className="py-3 text-center">₹ {m.total.toFixed(2)}</td>

                                    <td className="flex justify-center py-5 items-center">
                                        {!selectedRequest && (
                                            <button
                                                onClick={() => handleDeleteRow(i)}
                                                className="text-red-600 rounded-lg"
                                            >
                                                <i className="fa-solid fa-xmark fa-2xl"></i>
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                    {/* TOTAL */}
                    <div className="flex justify-end mt-4">
                        {!selectedRequest && (
                            <div className="flex justify-center items-center w-full">
                                <button
                                    onClick={handleAddRow}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    + Add New Material Row
                                </button>
                            </div>
                        )}


                        <div className="w-64 space-y-2">

                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹ {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>GST</span>
                                <span>₹ {gstTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>₹ {discountTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between font-bold border-t pt-2">
                                <span>Total</span>
                                <span>₹ {grandTotal.toFixed(2)}</span>
                            </div>

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

        </div>
    )
}

export default PurchaseOrderCreate