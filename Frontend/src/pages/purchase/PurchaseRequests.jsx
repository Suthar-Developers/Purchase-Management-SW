import React, { useState } from "react"
import PurchaseRequestList from "../../components/Purchase/PurchaseRequestList"
import CreatePurchaseRequest from "../../components/Purchase/CreatePurchaseRequest"

const PurchaseRequests = () => {

  const [view, setView] = useState("list")

  return (
    <div className="w-full h-full bg-slate-200">

      {view === "list" && (
        <PurchaseRequestList onCreate={() => setView("create")} />
      )}

      {view === "create" && (
        <CreatePurchaseRequest onBack={() => setView("list")} />
      )}

    </div>
  )
}

export default PurchaseRequests