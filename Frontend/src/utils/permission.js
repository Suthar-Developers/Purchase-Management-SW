export const isAdmin = (user) => {
    return (
        user?.role_id === "Admin" ||
        user?.role_id === "1" ||
        user?.role_id === 1
    );
};

export const hasRole = (user, roles = []) => {
    return roles.includes(user?.role_id);
};