export const ROLE_OPTIONS = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Purchase Manager" },
    { value: "3", label: "Purchase Executive" },
    { value: "4", label: "Purchase Senior Executive" },
    { value: "5", label: "Purchase Junior Executive" },
    { value: "6", label: "Site Supervisor" },
];

export const ROLE_LABELS = ROLE_OPTIONS.reduce((labels, role) => {
    labels[role.value] = role.label;
    return labels;
}, {});

export const getRoleLabel = (role) => {
    // Converts saved role ids like 1 into readable names like Admin.
    return ROLE_LABELS[String(role)] || role || "-";
};

export const normalizeRole = (role) => {
    // Allows old role names like "Admin" and new role ids like 1 to compare the same way.
    const roleText = String(role || "").trim();
    const matchedRole = ROLE_OPTIONS.find((option) => (
        option.value === roleText || option.label.toLowerCase() === roleText.toLowerCase()
    ));

    return matchedRole?.value || roleText;
};

export const isRoleAllowed = (currentRole, allowedRoles = []) => {
    const normalizedCurrentRole = normalizeRole(currentRole);
    return allowedRoles.some((role) => normalizeRole(role) === normalizedCurrentRole);
};
