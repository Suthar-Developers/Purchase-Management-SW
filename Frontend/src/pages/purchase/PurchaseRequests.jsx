import React, { useState } from "react";
import PurchaseRequestList from "../../components/Purchase/PurchaseRequestList";
import CreatePurchaseRequest from "../../components/Purchase/CreatePurchaseRequest";

const PurchaseRequests = () => {
  const [view, setView] = useState("list");
  const [requests, setRequests] = useState([]); // ✅ shared state

  return (
    <div className="w-full h-full bg-slate-200">

      {view === "list" && (
        <PurchaseRequestList
          onCreate={() => setView("create")}
          data={requests}   // ✅ pass data
        />
      )}

      {view === "create" && (
        <CreatePurchaseRequest
          onBack={() => setView("list")}
          onSave={(data) => {
            setRequests((prev) => [...prev, data]); // ✅ save data
            setView("list"); // ✅ go back to list
          }}
        />
      )}

    </div>
  );
};

export default PurchaseRequests;