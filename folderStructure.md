frontend/
│
├── package.json
├── vite.config.js
├── index.html
│
└── src/
    ├── main.jsx
    ├── App.jsx
    │
    ├── assets/
    │   └── logo.png
    │
    ├── api/
    │   ├── axios.js
    │   ├── auth.api.js
    │   ├── vendor.api.js
    │   ├── item.api.js
    │   ├── purchase.api.js
    │   ├── stock.api.js
    │   ├── bill.api.js
    │   └── report.api.js
    │
    ├── components/
    │   ├── common/
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Loader.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ConfirmDialog.jsx
    │   │
    │   ├── forms/
    │   │   ├── VendorForm.jsx
    │   │   ├── ItemForm.jsx
    │   │   ├── PurchaseRequestForm.jsx
    │   │   ├── PurchaseOrderForm.jsx
    │   │   └── PaymentForm.jsx
    │   │
    │   └── tables/
    │       ├── VendorTable.jsx
    │       ├── ItemTable.jsx
    │       ├── PurchaseRequestTable.jsx
    │       ├── PurchaseOrderTable.jsx
    │       └── StockTable.jsx
    │
    ├── pages/
    │   ├── auth/
    │   │   └── Login.jsx
    │   │
    │   ├── dashboard/
    │   │   └── Dashboard.jsx
    │   │
    │   ├── masters/
    │   │   ├── Vendors.jsx
    │   │   ├── Items.jsx
    │   │   └── Sites.jsx
    │   │
    │   ├── purchase/
    │   │   ├── PurchaseRequests.jsx
    │   │   ├── PurchaseOrders.jsx
    │   │   └── GRN.jsx
    │   │
    │   ├── billing/
    │   │   ├── Bills.jsx
    │   │   └── Payments.jsx
    │   │
    │   ├── reports/
    │   │   ├── StockReport.jsx
    │   │   └── PurchaseReport.jsx
    │   │
    │   └── settings/
    │       └── Users.jsx
    │
    ├── hooks/
    │   ├── useAuth.js
    │   └── useFetch.js
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── routes/
    │   └── AppRoutes.jsx
    │
    ├── store/        (if using Redux / Zustand)
    │   └── authStore.js
    │
    ├── utils/
    │   ├── formatDate.js
    │   └── constants.js
    │
    └── styles/
        └── global.css


backend/
│
├── package.json
├── .env
├── .gitignore
├── server.js
│
├── src/
│   ├── app.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Role.model.js
│   │   ├── Vendor.model.js
│   │   ├── Item.model.js
│   │   ├── Site.model.js
│   │   ├── PurchaseRequest.model.js
│   │   ├── PurchaseRequestItem.model.js
│   │   ├── PurchaseOrder.model.js
│   │   ├── PurchaseOrderItem.model.js
│   │   ├── GoodsReceipt.model.js
│   │   ├── Bill.model.js
│   │   ├── Payment.model.js
│   │   ├── Stock.model.js
│   │   └── AuditLog.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── vendor.controller.js
│   │   ├── item.controller.js
│   │   ├── site.controller.js
│   │   ├── purchaseRequest.controller.js
│   │   ├── purchaseOrder.controller.js
│   │   ├── grn.controller.js
│   │   ├── bill.controller.js
│   │   ├── payment.controller.js
│   │   ├── report.controller.js
│   │   └── audit.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── vendor.routes.js
│   │   ├── item.routes.js
│   │   ├── site.routes.js
│   │   ├── purchaseRequest.routes.js
│   │   ├── purchaseOrder.routes.js
│   │   ├── grn.routes.js
│   │   ├── bill.routes.js
│   │   ├── payment.routes.js
│   │   ├── report.routes.js
│   │   └── audit.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── purchase.service.js
│   │   ├── stock.service.js
│   │   ├── report.service.js
│   │   └── audit.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── vendor.validator.js
│   │   ├── item.validator.js
│   │   └── purchase.validator.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── logger.js
│   │   └── response.js
│   │
│   └── constants/
│       └── roles.js
│
└── uploads/
    └── bills/