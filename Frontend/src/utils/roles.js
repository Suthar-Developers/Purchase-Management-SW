export const ROLE_OPTIONS = [
    { value: "Admin", label: "Admin" },
    { value: "Purchase Manager", label: "Purchase Manager" },
    { value: "Purchase Executive", label: "Purchase Executive" },
    { value: "Purchase Senior Executive", label: "Purchase Senior Executive" },
    { value: "Purchase Junior Executive", label: "Purchase Junior Executive" },
    { value: "Site Supervisor", label: "Site Supervisor" },
];

export const ROLE_LABELS = ROLE_OPTIONS.reduce((labels, role) => {
    labels[role.value] = role.label;
    return labels;
}, {});

export const getRoleLabel = (role) => {
    const roleText = String(role || "").trim();

    return ROLE_LABELS[roleText] || roleText || "-";
};

export const normalizeRole = (role) => {
    const roleText = String(role || "").trim();

    const matchedRole = ROLE_OPTIONS.find(
        (option) =>
            option.value.toLowerCase() === roleText.toLowerCase() ||
            option.label.toLowerCase() === roleText.toLowerCase()
    );

    return matchedRole?.value || roleText;
};
export const isRoleAllowed = (currentRole, allowedRoles = []) => {
    const normalizedCurrentRole = normalizeRole(currentRole);

    return allowedRoles.some(
        (role) => normalizeRole(role) === normalizedCurrentRole
    );
};
