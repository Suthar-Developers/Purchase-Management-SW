import React, { useState, useEffect, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const PurchaseOrderCreate = ({ selectedRequest, onClose }) => {

  const pdfRef = useRef()

  const approvedMaterials =
    selectedRequest?.materials?.filter(
      (m) => m.materialStatus === "Approved"
    ) || []

  const [materials, setMaterials] = useState([])

  const [vendor, setVendor] = useState("")
  const [contactPerson, setContactPerson] = useState("")

  useEffect(() => {
    const formatted = approvedMaterials.map((m) => ({
      ...m,
      rate: "",
      gst: "",
      discount: "",
      total: 0
    }))

    setMaterials(formatted)
  }, [selectedRequest])

  // 🧮 CALCULATION
  const handleChange = (index, field, value) => {
    const updated = [...materials]

    updated[index][field] = value

    const qty = Number(updated[index].qty || 0)
    const rate = Number(updated[index].rate || 0)
    const gst = Number(updated[index].gst || 0)
    const discount = Number(updated[index].discount || 0)

    let total = qty * rate

    const gstAmount = (total * gst) / 100
    total += gstAmount
    total -= discount

    updated[index].total = total

    setMaterials(updated)
  }

  // TOTALS
  const subtotal = materials.reduce((sum, m) => sum + (m.qty * (m.rate || 0)), 0)
  const gstTotal = materials.reduce((sum, m) => sum + ((m.qty * (m.rate || 0) * (m.gst || 0)) / 100), 0)
  const discountTotal = materials.reduce((sum, m) => sum + (m.discount || 0), 0)

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
            <h1 className="text-xl font-bold">Your Company Name</h1>
            <p className="text-sm text-gray-500">Purchase Order</p>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-3 gap-4 mb-4">

            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-semibold">{selectedRequest?.projectName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <input
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="border px-2 py-1 w-full"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="border px-2 py-1 w-full"
              />
            </div>

          </div>

          {/* TABLE */}
          <table className="w-full text-sm border">

            <thead className="bg-gray-100">
              <tr>
                <th>Material</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((m, i) => (
                <tr key={i} className="text-center border-t">

                  <td>{m.material}</td>
                  <td>{m.qty}</td>

                  <td>
                    <input
                      className="w-20 border"
                      onChange={(e) => handleChange(i, "rate", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      className="w-16 border"
                      onChange={(e) => handleChange(i, "gst", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      className="w-16 border"
                      onChange={(e) => handleChange(i, "discount", e.target.value)}
                    />
                  </td>

                  <td>₹ {m.total.toFixed(2)}</td>

                </tr>
              ))}
            </tbody>

          </table>

          {/* TOTAL */}
          <div className="flex justify-end mt-4">
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