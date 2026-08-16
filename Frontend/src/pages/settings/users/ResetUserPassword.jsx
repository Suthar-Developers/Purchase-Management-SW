import React, { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, X, } from "lucide-react";
import { toast } from "react-hot-toast";
import { resetUserPassword } from "../../../api/userApi";
import PasswordRule from "../../../components/common/PasswordRule";

const ResetUserPassword = ({ user, onClose, onReset, }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password Rules
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Escape key
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


    // Submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate password
        if (
            !passwordRules.length ||
            !passwordRules.uppercase ||
            !passwordRules.number ||
            !passwordRules.symbol
        ) {
            toast.error("Password does not meet all requirements.");

            return;
        }


        // Confirm password
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");

            return;
        }


        try {
            setLoading(true);

            const response = await resetUserPassword(
                    user.user_id,
                    password
                );


            toast.success(response.message || "User password reset successfully.");

            // Clear form
            setPassword("");
            setConfirmPassword("");

            // Tell parent
            onReset?.();
            onClose?.();
        } catch (error) {
            console.error("Failed to reset password:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };


    if (!user) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-80 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget && !loading
                ) {
                    onClose?.();
                }
            }}
        >

            <div className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-100 text-amber-700">
                            <KeyRound size={20} />
                        </span>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">User Management</p>
                            <h2 className="text-lg font-bold text-slate-950">Reset Password</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close reset password"
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* User Information */}
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Resetting password for</p>

                    <div className="mt-2 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                            {user.full_name
                                ?.trim()
                                ?.split(/\s+/)
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(
                                    (word) =>
                                        word[0]
                                            ?.toUpperCase()
                                )
                                .join("") || "U"}
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
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-5 py-5">

                        {/* New Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>

                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    disabled={loading}
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                    className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-12 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    disabled={loading}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {showPassword ? (
                                        <EyeOff size={18}/>
                                    ) : (
                                        <Eye size={18}/>
                                    )}
                                </button>
                            </div>

                            {/* Password Rules */}
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <PasswordRule valid={passwordRules.length} text="At least 8 characters"/>
                                <PasswordRule valid={passwordRules.uppercase} text="One uppercase letter"/>
                                <PasswordRule valid={passwordRules.number} text="One number"/>
                                <PasswordRule valid={ passwordRules.symbol}text="One symbol"/>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>

                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    disabled={loading}
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                    className={`h-12 w-full rounded-md border bg-white pl-12 pr-12 text-sm text-slate-700 outline-none transition focus:ring-4 disabled:bg-slate-50 ${confirmPassword &&
                                            confirmPassword !==
                                            password
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-100"
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((current) => !current)}
                                    disabled={loading}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18}/>
                                    ) : (
                                        <Eye size={18}/>
                                    )}
                                </button>
                            </div>

                            {confirmPassword && confirmPassword !== password && (
                                    <p className="mt-2 text-xs font-medium text-red-600">Passwords do not match.</p>
                                )}
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mx-5 mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-xs leading-5 text-amber-800">
                            Resetting this password will sign the user
                            out of their existing sessions.
                        </p>
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
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-600 px-5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}

                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetUserPassword;