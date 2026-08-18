import React, { useEffect, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const ConfirmDeleteUser = ({ user, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.key === "Escape" && !loading
            ) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [loading, onClose]);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm?.();
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    const initials = user.full_name
        ?.trim()
        ?.split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            (word) =>
                word[0]?.toUpperCase()
        )
        .join("") || "U";

    return (
        <div
            className="fixed inset-0 z-100 grid place-items-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget && !loading
                ) {
                    onClose?.();
                }
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-md bg-rose-100 text-rose-700">
                            <AlertTriangle size={20} />
                        </span>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">User Management</p>

                            <h2 className="text-lg font-bold text-slate-950">Delete User</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close delete user"
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* User */}
                <div className="px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user.full_name || "Unnamed user"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                        <p className="text-sm font-semibold text-rose-800">
                            Are you sure you want to delete this user?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-rose-700">
                            This action permanently removes the
                            user's account. Existing refresh-token
                            sessions will also be removed.
                        </p>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs leading-5 text-slate-600">
                            This cannot be undone from the User
                            Management screen.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                            <Trash2 size={16} />
                        )}

                        {loading ? "Deleting..." : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteUser;