import React, { useState } from "react";
import PurchaseRequestList from "../../components/models/PurchaseRequestList";
import CreatePurchaseRequest from "../../components/models/CreatePurchaseRequest";

const PurchaseRequests = () => {
  const [view, setView] = useState("list");
  const [requests, setRequests] = useState([]);

  return (
    <div className="w-full h-full bg-slate-200">

      {view === "list" && (
        <PurchaseRequestList
          onCreate={() => setView("create")}
          data={requests}
        />
      )}

      {view === "create" && (
        <CreatePurchaseRequest
          onBack={() => setView("list")}
          onSave={(data) => {
            setRequests((prev) => [...prev, data]);
            setView("list");
          }}
        />
      )}

    </div>
  );
};

export default PurchaseRequests;