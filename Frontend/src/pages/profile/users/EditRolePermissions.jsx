import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ShieldCheck, X } from "lucide-react";
import { getRolePermissions, updateRolePermissions } from "../../../api/userApi";
import { ROLE_OPTIONS } from "../../../utils/roles";
import { ACTION_LABELS, PERMISSION_MODULES, normalizePermissionMap } from "../../../utils/permissions";

const EditRolePermissions = ({ role: initialRole = "Purchase Manager", onClose, onUpdated }) => {
    const [role, setRole] = useState(initialRole || "Purchase Manager");
    const [permissions, setPermissions] = useState(() => normalizePermissionMap());
    const [modules, setModules] = useState(PERMISSION_MODULES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                setLoading(true);
                const response = await getRolePermissions(role);
                setModules(Array.isArray(response?.modules) ? response.modules : PERMISSION_MODULES);
                setPermissions(normalizePermissionMap(response?.permissions));
            } catch (error) {
                console.error("Failed to load role permissions:", error);
                toast.error(error.response?.data?.message || error.message || "Unable to load role permissions.");
            } finally {
                setLoading(false);
            }
        };

        loadPermissions();
    }, [role]);

    const togglePermission = (moduleKey, actionKey) => {
        setPermissions((current) => ({
            ...current,
            [moduleKey]: {
                ...current[moduleKey],
                [actionKey]: !current?.[moduleKey]?.[actionKey],
            },
        }));
    };

    const toggleModule = (module) => {
        const allAllowed = module.actions.every((action) => permissions?.[module.key]?.[action]);

        setPermissions((current) => ({
            ...current,
            [module.key]: Object.fromEntries(module.actions.map((action) => [action, !allAllowed])),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            const response = await updateRolePermissions(role, permissions);
            toast.success(response?.message || "Role permissions updated successfully.");
            onUpdated?.(role, response?.permissions);
        } catch (error) {
            console.error("Failed to update role permissions:", error);
            toast.error(error.response?.data?.message || error.message || "Unable to update role permissions.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-60 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving) {
                    onClose?.();
                }
            }}
        >
            <form onSubmit={handleSubmit} className="flex max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-cyan-700">
                            <ShieldCheck size={20} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Admin action</p>
                            <h2 className="text-lg font-bold text-slate-950">Role Permissions</h2>
                            <p className="text-sm text-slate-500">These defaults apply to every user assigned this role.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close role permissions"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        disabled={saving}
                        className="mb-5 h-11 w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    >
                        {ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="h-16 animate-pulse rounded-md bg-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border border-slate-200">
                            <table className="w-full min-w-190">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                        <th className="w-64 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Page</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Permissions</th>
                                        <th className="w-32 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">All</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {modules.map((module) => {
                                        const allAllowed = module.actions.every((action) => permissions?.[module.key]?.[action]);

                                        return (
                                            <tr key={module.key} className="border-b border-slate-100 last:border-b-0">
                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">{module.label}</p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {module.actions.map((action) => (
                                                            <label key={action} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={Boolean(permissions?.[module.key]?.[action])}
                                                                    onChange={() => togglePermission(module.key, action)}
                                                                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                                                                />
                                                                {ACTION_LABELS[action] || action}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleModule(module)}
                                                        className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold transition ${allAllowed ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                                    >
                                                        {allAllowed ? "Clear" : "Allow"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || saving}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                        {saving ? "Saving..." : "Save Role Permissions"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRolePermissions;
