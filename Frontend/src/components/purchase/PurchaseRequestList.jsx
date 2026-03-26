import { useState, useEffect } from "react"
import { fetchPurchaseRequests } from "../../api/purchaseRequestApi"
import Button from "../common/Button"

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

const PurchaseRequestList = ({ onCreate}) => {

  const [purchaseRequest, setPurchaseRequest] = useState([])

  const getPurchaseRequests = async () => {
    try{
      const data = await fetchPurchaseRequests()
      
      setPurchaseRequest(data)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    getPurchaseRequests()
  }, [])

  return (
    <div className="w-full h-full bg-slate-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col p-6">

        {/* Header */}
        <div className="px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold pb-6">
            Purchase Requests
          </h1>
          <Button lable={"+ New Request"} onClick={onCreate} />
        </div>

        {/* Table Card */}
        <div className="flex-1 overflow-auto rounded-lg">

          <table className="w-full text-sm">

            <thead className="bg-[#4b5ea3] text-white">
              <tr>
                <th className="p-4 text-center">MR No</th>
                <th className="p-4 text-center">Material</th>
                <th className="p-4 text-center">Specification</th>
                <th className="p-4 text-center">Send To</th>
                <th className="p-4 text-center">Initiator</th>
                <th className="p-4 text-center">Contact Info</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {purchaseRequest.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-400">
                    No requests yet
                  </td>
                </tr>
              ) : (
                purchaseRequest.map((req, index) => (
                  <tr className="border border-b-gray-300 border-x-gray-100" key={index}>
                    <td className="py-2 text-center">MR-{index + 1}</td>
                    <td className="py-2 text-center">{req.material}</td>
                    <td className="py-2 text-center">{req.specification}</td>
                    <td className="py-2 text-center">{req.sendTo}</td>
                    <td className="py-2 text-center">{req.contactPerson}</td>
                    <td className="py-2 text-center">{req.contactInfo}</td>
                    <td className="py-2 text-center">Active</td>
                    <td className="py-2 text-center">...</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}

export default PurchaseRequestList