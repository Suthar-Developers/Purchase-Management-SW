import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Power, X, } from "lucide-react";

const ConfirmUserStatus = ({ user, nextStatus, onClose, onConfirm, }) => {
    const [loading, setLoading] = useState(false);

    const isActivating = nextStatus === "Active";

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
            className="fixed inset-0 z-90 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
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
                        <span
                            className={`grid h-10 w-10 place-items-center rounded-md ${isActivating
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                                }`}
                        >
                            {isActivating ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <AlertTriangle size={20} />
                            )}
                        </span>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User Management</p>

                            <h2 className="text-lg font-bold text-slate-950">
                                {isActivating ? "Activate User" : "Deactivate User"}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* User */}
                <div className="px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">{initials}</div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user.full_name || "Unnamed user"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div
                        className={`mt-5 rounded-lg border px-4 py-3 ${isActivating
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-amber-200 bg-amber-50"
                            }`}
                    >
                        <p
                            className={`text-sm leading-6 ${isActivating
                                ? "text-emerald-800"
                                : "text-amber-800"
                                }`}
                        >
                            {isActivating
                                ? "This will activate the user's account and allow them to sign in again."
                                : "This will deactivate the user's account. Their active refresh sessions will also be revoked."}
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
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${isActivating
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-amber-600 hover:bg-amber-700"
                            }`}
                    >

                        {loading ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                            <Power size={16} />
                        )}

                        {loading
                            ? "Updating..."
                            : isActivating
                                ? "Activate User"
                                : "Deactivate User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmUserStatus;