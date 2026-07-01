import { useState, useEffect } from "react"
import { fetchPurchaseRequests } from "../../api/purchaseRequestApi"
import Button from "../common/Button"
import PurchaseRequestView from "./PurchaseRequestView"
import { exportPagePdf, filterRowsByDateRange } from "../../utils/pagePdfExport"

const StatusBadge = ({ status }) => {

  const styles = {
    Active: "bg-green-100 text-green-700",
    Reject: "bg-red-100 text-red-700",
    Hold: "bg-yellow-100 text-yellow-700"
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const PurchaseRequestList = ({ onCreate }) => {

  const [purchaseRequest, setPurchaseRequest] = useState([])
  const [isViewModelOpen, setIsViewModelOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState()
  const [downloadRange, setDownloadRange] = useState({ startDate: '', endDate: '' })

  const getPurchaseRequests = async () => {
    try {
      const data = await fetchPurchaseRequests()

      setPurchaseRequest(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPurchaseRequests()
  }, [])

  const openView = (req) => {
    setIsViewModelOpen(true)
    setSelectedRequest(req)
  }

  const closeView = () => {
    setIsViewModelOpen(false)
  }

  const downloadRequestsPdf = () => {
    const rows = filterRowsByDateRange(purchaseRequest, downloadRange.startDate, downloadRange.endDate, (request) => request.created_pr_at || request.deliverBefore)
    exportPagePdf({
      title: 'Purchase Requests Data',
      fileName: 'purchase-requests-data',
      rows,
      startDate: downloadRange.startDate,
      endDate: downloadRange.endDate,
      columns: [
        { label: 'PR No', render: (request) => `PR-${request.request_id}` },
        { label: 'Project', key: 'projectName' },
        { label: 'Initiator', key: 'contactPerson' },
        { label: 'Contact Info', key: 'contactInfo' },
        { label: 'Status', key: 'requestStatus' },
        { label: 'Deliver Before', key: 'deliverBefore' },
        { label: 'Items', render: (request) => request.materials?.length || 0 },
      ],
    })
  }

  return (
    <div className="w-full h-full bg-slate-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl h-[85%] flex flex-col p-6 overflow-auto">

        {/* Header */}
        <div className="px-6 flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-lg font-bold pb-3">
            Purchase Requests
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={downloadRange.startDate}
              onChange={(e) => setDownloadRange((current) => ({ ...current, startDate: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
              title="Download from date"
            />
            <input
              type="date"
              value={downloadRange.endDate}
              onChange={(e) => setDownloadRange((current) => ({ ...current, endDate: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
              title="Download to date"
            />
            <Button
              icon={<i className="fa-solid fa-download"></i>}
              onClick={downloadRequestsPdf}
              className='grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:cursor-pointer'
              title="Download purchase requests PDF"
              aria-label="Download purchase requests PDF"
            />
            <Button lable={"+ New Request"} className='px-4 py-2 mb-2 font-medium text-sm bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer text-white' onClick={onCreate} />
          </div>
        </div>

        {/* Table Card */}
        <div className="flex-1 rounded-lg">
          <table className="w-full overflow-auto text-xs">
            <thead className="bg-[#4b5ea3] text-white">
              <tr>
                <th className="p-3 text-center rounded-tl-lg">PR No</th>
                <th className="p-3 text-center">Project</th>
                <th className="p-3 text-center">Initiator</th>
                <th className="p-3 text-center">Contact Info</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>

            <tbody className="">
              {purchaseRequest.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    No requests yet
                  </td>
                </tr>
              ) : (
                purchaseRequest.map((req, index) => (
                  <tr className="border border-b-gray-300 border-x-gray-100" key={index}>
                    <td className="py-3 text-center">PR-{req.request_id}</td>
                    <td className="py-3 text-center">{req.projectName}</td>
                    <td className="py-3 text-center">{req.contactPerson}</td>
                    <td className="py-3 text-center">{req.contactInfo}</td>

                    <td className="py-3 text-center font-medium">{req.requestStatus}</td>

                    <td className="py-3 text-center">
                      <button onClick={() => openView(req)} className="text-blue-700 hover:text-green-600 hover:scale-120"><i className="fa-notdog fa-solid fa-eye fa-lg hover:cursor-pointer"></i></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isViewModelOpen && (
          <PurchaseRequestView req={selectedRequest} onClose={closeView} refreshRequest={getPurchaseRequests}/>
        )}

      </div>
    </div>
  )
}

export default PurchaseRequestList
