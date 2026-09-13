import { isRoleAllowed } from "./roles";

export const PERMISSION_MODULES = [
    { key: "dashboard", label: "Dashboard", actions: ["view"] },
    { key: "projects", label: "Projects", actions: ["view", "create", "edit"] },
    { key: "vendors", label: "Vendors", actions: ["view", "create", "edit"] },
    { key: "purchase_requests", label: "Purchase Requests", actions: ["view", "create", "edit", "approve"] },
    { key: "purchase_orders", label: "Purchase Orders", actions: ["view", "create", "edit", "approve"] },
    { key: "users", label: "Users", actions: ["view", "create", "edit", "delete"], adminOnly: true },
];

export const ACTION_LABELS = {
    view: "View",
    create: "Create",
    edit: "Edit",
    approve: "Approve",
    delete: "Delete",
};

export const hasPermission = (user, moduleKey, actionKey = "view") => {
    if (isRoleAllowed(user?.role, ["Admin"])) {
        return true;
    }

    return Boolean(user?.permissions?.[moduleKey]?.[actionKey]);
};

export const emptyPermissionMap = () => Object.fromEntries(
    PERMISSION_MODULES.map((module) => [
        module.key,
        Object.fromEntries(module.actions.map((action) => [action, false])),
    ])
);

export const normalizePermissionMap = (permissions = {}) => {
    const normalized = emptyPermissionMap();

    PERMISSION_MODULES.forEach((module) => {
        module.actions.forEach((action) => {
            normalized[module.key][action] = Boolean(permissions?.[module.key]?.[action]);
        });
    });

    return normalized;
};
