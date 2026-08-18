import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, SlidersHorizontal, Users, UserRound, Shield, CircleCheck, CircleX, MoreVertical, } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllUsers } from "../../api/userApi";

const ROLE_OPTIONS = [
    { value: "", label: "All roles" },
    { value: "Admin", label: "Admin" },
    { value: "Purchase Manager", label: "Purchase Manager" },
    { value: "Purchase Executive", label: "Purchase Executive" },
    { value: "Purchase Senior Executive", label: "Purchase Senior Executive" },
    { value: "Purchase Junior Executive", label: "Purchase Junior Executive" },
    { value: "Site Supervisor", label: "Site Supervisor" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];

const UserManagement = ({ onEditUser, onResetPassword, onChangePassword, onToggleStatus, onDeleteUser, onUsersLoaded }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [openActionId, setOpenActionId] = useState(null);

    // Load users
    const loadUsers = useCallback(async (showRefreshState = false) => {
        try {
            if (showRefreshState) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getAllUsers();

            setUsers(
                Array.isArray(response?.users)
                    ? response.users
                    : []
            );

            onUsersLoaded?.(
                Array.isArray(response?.users)
                    ? response.users
                    : []
            );
        } catch (error) {
            console.error("Failed to load users:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers, onEditUser, onToggleStatus]);

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenActionId(null);
        };

        if (openActionId !== null) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [openActionId]);

    // Filtering
    const filteredUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch = !searchValue || user.full_name?.toLowerCase().includes(searchValue) || user.username?.toLowerCase().includes(searchValue);

            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;

            return (matchesSearch && matchesRole && matchesStatus);
        });
    }, [users, search, roleFilter, statusFilter,]);

    // Statistics
    const activeCount = useMemo(() =>
        users.filter((user) =>
            user.status === "Active"
        ).length, [users]
    );

    const inactiveCount = useMemo(() =>
        users.filter((user) =>
            user.status === "Inactive"
        ).length, [users]
    );

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setStatusFilter("");
    };

    const hasFilters =
        Boolean(search) ||
        Boolean(roleFilter) ||
        Boolean(statusFilter);

    // Action handler
    const handleAction = async (callback, user) => {
        setOpenActionId(null);
        try {
            await callback?.(user);
            await loadUsers(true);
        } catch (error) {
            // Parent already handles the error/toast.
            console.error("User action failed:", error);
        }
    };

    return (
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
                            <Users size={21} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-950">User Management</h2>
                            <p className="text-sm text-slate-500">Manage users, roles and account status.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadUsers(true)}
                        disabled={loading || refreshing}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Statistics */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-500" />

                            <span className="text-xs font-medium text-slate-500">Total users</span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-slate-950">{users.length}</p>
                    </div>

                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <CircleCheck size={16} className="text-emerald-600" />

                            <span className="text-xs font-medium text-emerald-700">Active</span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-emerald-800">{activeCount}</p>
                    </div>

                    <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <CircleX size={16} className="text-rose-600" />

                            <span className="text-xs font-medium text-rose-700">Inactive</span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-rose-800">{inactiveCount}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <SlidersHorizontal size={16} />
                    Filters
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div className="relative lg:col-span-2">
                        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name or username..."
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        />
                    </div>

                    {/* Role */}
                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role.value || "all"} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status.value || "all"} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>

                </div>

                {hasFilters && (
                    <div className="mt-3 flex items-center justify-between">

                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredUsers.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {users.length}
                            </span>{" "}
                            users
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="min-w-212.5 w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-white text-left">
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                User
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Username
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Role
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Loading */}
                        {loading && (
                            Array.from({ length: 5 }).map(
                                (_, index) => (
                                    <tr key={index} className="border-b border-slate-100">
                                        <td colSpan={5} className="px-5 py-4">
                                            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                                        </td>
                                    </tr>
                                )
                            )
                        )}

                        {/* Empty */}
                        {!loading &&
                            filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center">

                                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                                            <Users size={21} />
                                        </div>

                                        <h3 className="mt-3 text-sm font-semibold text-slate-900">No users found</h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {hasFilters ? "Try changing your search or filters." : "No users are available."}
                                        </p>

                                        {hasFilters && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="mt-4 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}

                        {/* Users */}
                        {!loading &&
                            filteredUsers.map((user) => {

                                const initials =
                                    user.full_name
                                        ?.trim()
                                        ?.split(/\s+/)
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map(
                                            (word) =>
                                                word[0]
                                                    ?.toUpperCase()
                                        )
                                        .join("") ||
                                    "U";

                                const isActive = user.status === "Active";

                                return (
                                    <tr key={user.user_id} className="border-b border-slate-100 transition hover:bg-slate-50/70">

                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                                                    {initials}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {user.full_name || "Unnamed user"}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        ID #{user.user_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Username */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <UserRound size={15} className="text-slate-400" />
                                                {user.username}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                                <Shield size={13} />
                                                {user.role}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isActive
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-rose-50 text-rose-700"
                                                    }`}
                                            >
                                                {isActive ? (
                                                    <CircleCheck size={13} />
                                                ) : (
                                                    <CircleX size={13} />
                                                )}

                                                {user.status || "Unknown"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="relative px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenActionId((current) => current === user.user_id ? null : user.user_id);
                                                }}
                                                className="inline-grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                                aria-label={`Actions for ${user.username}`}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openActionId === user.user_id && (
                                                <div
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                    className="absolute right-5 top-14 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(onEditUser, user)}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Edit User
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(onResetPassword, user)}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Reset Password
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(onChangePassword, user)}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Change Password
                                                    </button>

                                                    <div className="my-1 border-t border-slate-100" />

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(onToggleStatus, user)}
                                                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-slate-50 ${isActive ? "text-amber-700" : "text-emerald-700"}`}
                                                    >
                                                        {isActive ? "Deactivate User" : "Activate User"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(onDeleteUser, user)}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {!loading && filteredUsers.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                        Showing{" "}
                        <strong className="text-slate-700">
                            {filteredUsers.length}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-slate-700">
                            {users.length}
                        </strong>{" "}
                        users
                    </span>

                    <span>Search and filters apply instantly.</span>
                </div>
            )}
        </section>
    );
};

export default UserManagement;