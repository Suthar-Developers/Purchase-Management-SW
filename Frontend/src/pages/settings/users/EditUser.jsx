import React, { useEffect, useState } from "react";
import { AtSign, Save, Shield, User, X, } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateUser } from "../../../api/userApi";

const roleOptions = [
    {
        value: "Admin",
        label: "Admin",
    },
    {
        value: "Purchase Manager",
        label: "Purchase Manager",
    },
    {
        value: "Purchase Executive",
        label: "Purchase Executive",
    },
    {
        value: "Purchase Senior Executive",
        label: "Purchase Senior Executive",
    },
    {
        value: "Purchase Junior Executive",
        label: "Purchase Junior Executive",
    },
    {
        value: "Site Supervisor",
        label: "Site Supervisor",
    },
];

const EditUser = ({ user, onClose, onUpdated, }) => {

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        role: "",
    });

    const [loading, setLoading] = useState(false);

    // Load selected user
    useEffect(() => {
        if (!user) {
            return;
        }

        setFormData({
            fullName: user.full_name || "",
            username: user.username || "",
            role: user.role || "",
        });
    }, [user]);


    // Handle input
    const handleChange = (event) => {
        const { name, value, } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };


    // Submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        const fullName = formData.fullName.trim();
        const username = formData.username.trim();

        if (!fullName) {
            toast.error("Full name is required.");
            return;
        }

        if (!username) {
            toast.error("Username is required.");
            return;
        }

        if (!formData.role) {
            toast.error("Please select a role.");
            return;
        }

        try {
            setLoading(true);

            const response = await updateUser(
                user.user_id,
                {
                    fullName,
                    username,
                    role: formData.role,
                }
            );

            toast.success(
                response.message ||
                "User updated successfully."
            );

            // Send updated user back to Profile
            onUpdated?.({
                ...user,
                full_name: fullName,
                username,
                role: formData.role,
            });

            onClose?.();
        } catch (error) {
            console.error("Failed to update user:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to update user."
            );
        } finally {
            setLoading(false);
        }
    };

    // No user
    if (!user) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-70 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
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
                        <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-100 text-cyan-700">
                            <User size={20} />
                        </span>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">User Management</p>

                            <h2 className="text-lg font-bold text-slate-950">Edit User</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-5 py-5">

                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Enter full name"
                                    className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                            <div className="relative">
                                <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Enter username"
                                    className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50"
                                />
                            </div>

                            <p className="mt-1.5 text-xs text-slate-500">This username is used to sign in.</p>
                        </div>


                        {/* Role */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                            <div className="relative">
                                <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="h-12 w-full appearance-none rounded-md border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50"
                                >

                                    <option value="">Select a role</option>

                                    {roleOptions.map(
                                        (role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
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
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            ) : (
                                <Save size={16} />
                            )}

                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;