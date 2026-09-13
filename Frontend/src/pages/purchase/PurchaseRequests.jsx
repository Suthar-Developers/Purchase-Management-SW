import React, { useState } from "react";
import PurchaseRequestList from "../../components/models/PurchaseRequestList";
import CreatePurchaseRequest from "../../components/models/CreatePurchaseRequest";
import useAuth from "../../hooks/useAuth";
import { hasPermission } from "../../utils/permissions";

const PurchaseRequests = () => {
  const { user } = useAuth();
  const canCreate = hasPermission(user, "purchase_requests", "create");
  const [view, setView] = useState("list");
  const [requests, setRequests] = useState([]);

  return (
    <div className="w-full h-full bg-slate-200">

      {view === "list" && (
        <PurchaseRequestList
          onCreate={canCreate ? () => setView("create") : undefined}
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
