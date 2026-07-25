import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AtSign, Eye, EyeOff, Lock, Shield, User, UserPlus, X } from "lucide-react";
import Input from "../../../components/common/Input";
import PasswordRule from "../../../components/common/PasswordRule";
import { createNewUser } from "../../../api/userApi";
import { getStoredUser, isAdminUser } from "../../../utils/userPreferences";

const roleOptions = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Purchase Manager" },
    { value: "3", label: "Purchase Executive" },
    { value: "4", label: "Purchase Senior Executive" },
    { value: "5", label: "Purchase Junior Executive" },
    { value: "6", label: "Site Supervisor" },
];

const emptyForm = {
    fullName: "",
    username: "",
    password: "",
    role: "",
};

const CreateUser = ({ isModal = false, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const currentUser = getStoredUser();
    const canCreateUser = isAdminUser(currentUser);

    useEffect(() => {
        if (!isModal) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isModal, loading, onClose]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            toast.error("Please write username and password");
            return;
        }

        if (!formData.role) {
            toast.error("Please select a role");
            return;
        }

        try {
            setLoading(true);
            const data = await createNewUser(formData);

            toast.success(data.message, {
                duration: 7000,
            });

            setFormData(emptyForm);
        } catch (error) {
            console.error("Failed to create new user", error);
            toast.error(error.message || "Failed to create new user");
        } finally {
            setLoading(false);
        }
    };

    const password = formData.password;
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (!canCreateUser) {
        if (isModal) return null;

        return (
            <main className="min-h-screen bg-slate-50 px-5 py-6 lg:px-8">
                <div className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <h1 className="text-lg font-bold text-slate-950">Access denied</h1>
                    <p className="mt-2 text-sm text-slate-600">Only admins can create new users.</p>
                </div>
            </main>
        );
    }

    const form = (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-cyan-700">
                        <UserPlus size={20} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Admin action</p>
                        <h1 className="text-lg font-bold text-slate-950">Create User</h1>
                    </div>
                </div>

                {isModal && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close create user"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-5">
                <p className="text-sm text-slate-600">Set up an account and assign the right workspace role.</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Full name"
                        placeholder="Alex Morgan"
                        icon={<User size={16} />}
                        disabled={loading}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <Input
                        label="Username"
                        placeholder="@alex.morgan"
                        icon={<AtSign size={16} />}
                        disabled={loading}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        rightText="Used to sign in"
                    />

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter a secure password"
                                name="password"
                                disabled={loading}
                                value={formData.password}
                                onChange={handleChange}
                                className="h-12 w-full rounded-md border border-gray-300 pl-12 pr-12 text-gray-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                            <PasswordRule valid={passwordRules.length} text="At least 8 characters" />
                            <PasswordRule valid={passwordRules.uppercase} text="One uppercase letter" />
                            <PasswordRule valid={passwordRules.number} text="One number" />
                            <PasswordRule valid={passwordRules.symbol} text="One symbol" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>

                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                            <select
                                name="role"
                                disabled={loading}
                                value={formData.role}
                                onChange={handleChange}
                                className="h-12 w-full rounded-md border border-gray-300 bg-white pl-12 pr-5 text-gray-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-500"
                            >
                                <option value="">Select a role</option>
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {loading ? "Creating user..." : "Create User"}
                </button>
            </div>
        </form>
    );

    if (isModal) {
        return (
            <div
                className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !loading) {
                        onClose?.();
                    }
                }}
            >
                <div className="w-full max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
                    {form}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-5 py-6 lg:px-8">
            <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                {form}
            </div>
        </main>
    );
};

export default CreateUser;
