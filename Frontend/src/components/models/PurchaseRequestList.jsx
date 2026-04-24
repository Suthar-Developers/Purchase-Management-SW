import { useState, useEffect } from "react"
import { fetchPurchaseRequests } from "../../api/purchaseRequestApi"
import Button from "../common/Button"
import PurchaseRequestView from "./PurchaseRequestView"

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

  return (
    <div className="w-full h-full bg-slate-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl h-[85%] flex flex-col p-6 overflow-auto">

        {/* Header */}
        <div className="px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold pb-6">
            Purchase Requests
          </h1>
          <Button lable={"+ New Request"} className='px-4 py-2 font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer text-white' onClick={onCreate} />
        </div>

        {/* Table Card */}
        <div className="flex-1 rounded-lg">

          <table className="w-full overflow-auto text-sm">

            <thead className="bg-[#4b5ea3] text-white">
              <tr>
                <th className="p-4 text-center">PR No</th>
                <th className="p-4 text-center">Project</th>
                <th className="p-4 text-center">Initiator</th>
                <th className="p-4 text-center">Contact Info</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
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

                    <td className="py-3 text-center">
                      <StatusBadge status={req.requestStatus} />
                    </td>

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