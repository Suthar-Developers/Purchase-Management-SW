import React, { useState } from "react"
import { updateMaterialStatus } from "../../api/purchaseRequestApi"

const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const Field = ({ label, value }) => (
    <div className="bg-gray-100 p-3 rounded-lg">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold">{value || "-"}</p>
    </div>
)

const PurchaseRequestView = ({ req, onClose, refreshRequest }) => {

    const [activeIndex, setActiveIndex] = useState(0)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null)
    const [materials, setMaterials] = useState(req.materials || [])

    if (!req) return null

    const material = materials?.[activeIndex]

    const handleMaterialAction = async (material_id, materialStatus) => {
        try {
            const updatedMaterials = [...materials]

            updatedMaterials[selectedMaterialIndex].materialStatus = materialStatus

            setMaterials(updatedMaterials)

            const res = await updateMaterialStatus(material_id, materialStatus)

            alert(res?.message || "Material status updated successfully")

            await refreshRequest()
            setShowApprovalModal(false)
            onClose()

        } catch (error) {
            console.error(error)
            alert("Failed to update status")
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

            <div className="bg-white w-[75%] rounded-2xl shadow-2xl p-6 relative">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl"
                >✕</button>

                {/* 🔷 HEADER SECTION */}
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                    Purchase Request Details
                </h2>

                <div className="grid grid-cols-3 gap-3 pb-3 mb-4 border-b">
                    <Field label="MR No" value={`MR-${req.request_id}`} />
                    <Field label="Project" value={req.projectName} />
                    <Field label="Contact Person" value={req.contactPerson} />
                    <Field label="Contact Info" value={req.contactInfo} />
                    <Field label="Status" value={req.requestStatus} />
                    <Field label="Deliver Before" value={formatDate(req.deliverBefore)} />
                </div>

                {/* 🔷 MATERIAL BUTTONS */}
                <div className="flex justify-between mb-4">
                    <div className="flex gap-2 flex-wrap ml-5">
                        {req.materials?.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`px-4 py-2 rounded-lg 
                ${activeIndex === i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                            >
                                Material {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mr-5">
                        <button
                            onClick={() => {
                                setSelectedMaterialIndex(activeIndex)
                                setShowApprovalModal(true)
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-500"
                        >
                            Action
                        </button>
                    </div>
                </div>

                {/* 🔷 MATERIAL DETAILS */}
                {material && (
                    <div className="grid grid-cols-4 gap-3">

                        <Field label="Material" value={material.material} />
                        <Field label="Specification" value={material.specification} />
                        <Field label="Make" value={material.make} />
                        <Field label="Size" value={material.size} />
                        <Field label="Thickness" value={material.thickness} />
                        <Field label="Qty" value={material.qty} />
                        <Field label="Unit" value={material.unit} />
                        <Field label="NT Item" value={material.isNtItem ? "Yes" : "No"} />
                        <Field label="BOQ Ref" value={material.boqRef} />
                        <Field label="Scope" value={material.scope} />
                        <Field label="Category" value={material.category} />
                        <Field label="Status" value={material.materialStatus || "Pending"} />

                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end border-t pt-3 mt-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>

                {showApprovalModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

                        <div className="bg-white rounded-xl p-6 w-75 shadow-xl">

                            <h3 className="text-lg font-semibold mb-4 text-center">
                                Material Action
                            </h3>

                            <div className="flex flex-col gap-3">

                                {/* ✅ APPROVE */}
                                <button
                                    onClick={() => handleMaterialAction(material.material_id, "Approved")}
                                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
                                >
                                    <i className="fa-solid fa-check"></i>
                                    Approve
                                </button>

                                {/* ⚠️ Pending */}
                                <button
                                    onClick={() => handleMaterialAction(material.material_id, "Pending")}
                                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-400 text-gray-800 font-medium hover:bg-yellow-500 active:scale-[0.98] transition-all duration-150 shadow-sm"
                                >
                                    <i className="fa-solid fa-pause"></i>
                                    Pending
                                </button>

                                {/* ❌ REJECT */}
                                <button
                                    onClick={() => handleMaterialAction(material.material_id, "Rejected")}
                                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                    Reject
                                </button>

                            </div>

                            <button
                                onClick={() => setShowApprovalModal(false)}
                                className="mt-4 w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default PurchaseRequestView