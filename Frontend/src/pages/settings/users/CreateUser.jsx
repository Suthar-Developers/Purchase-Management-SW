import React, { useState } from "react";
import FeatureCard from "../../../components/common/FeatureCard";
import Input from "../../../components/common/Input";
import PasswordRule from "../../../components/common/PasswordRule";
import { ArrowRight, AtSign, Eye, EyeOff, Lock, Shield, User } from "lucide-react";

const CreateUser = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const password = formData.password;

    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return (
        <div className="flex flex-col lg:flex-row lg:h-screen min-h-screen font-sans bg-white overflow-hidden">
            {/* LEFT PANEL */}
            <div className="relative hidden lg:flex lg:w-2/5 xl:w-[42%] h-full overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 bg-linear-to-br from-[#12182e] via-[#171d57] to-[#2a2960]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.62) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.62) 1px, transparent 1px)`, backgroundSize: "58px 58px", }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between w-full p-8 xl:p-10">

                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                                <img src="/Logo.jpeg" width={58} height={58} alt="" />
                            </div>

                            <div>
                                <h2 className="text-white text-2xl font-bold">JRC Interiors</h2>

                                <p className="uppercase tracking-[5px] text-indigo-300 text-[clamp(.95rem,1vw,1.1rem)] mt-1">Team Management</p>
                            </div>
                        </div>

                        <h1 className="text-white text-[clamp(2rem,2.8vw,2.5rem)] font-bold tracking-[5px] leading-[1.05] mt-10">
                            Invite a new
                            <br />
                            member to your
                            <br />
                            workspace.
                        </h1>

                        <p className="text-gray-300 text-base leading-6 mt-5 max-w-md">
                            Configure their identity, credentials and role.
                            They'll receive access as soon as you finish this form.
                        </p>

                        {/* Feature Cards */}
                        <div className="space-y-2.5 mt-4">
                            <FeatureCard
                                title="SSO ready"
                                desc="SAML & OIDC supported"
                            />

                            <FeatureCard
                                title="Audit logged"
                                desc="Every action recorded"
                            />

                            <FeatureCard
                                title="Role-based access"
                                desc="Least privilege by default"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between mt-6 text-gray-400 text-sm">
                        <p>© 2026 JRC Interiors</p>

                        <div className="flex gap-8">
                            <button>Docs</button>
                            <button>Support</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex justify-center items-center bg-white px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-0 overflow-hidden">
                <div className="w-full max-w-md md:max-w-lg xl:max-w-xl flex flex-col justify-center">
                    <p className="uppercase text-indigo-600 tracking-widest font-semibold text-sm">Step 1 of 1</p>

                    <h1 className="text-[clamp(2rem,3vw,3rem)] font-bold text-slate-900 mt-3">Create a new user</h1>

                    <p className="text-gray-500 mt-1 text-lg">Set up an account and assign a role.</p>

                    <div className="space-y-3 mt-4">
                        {/* Full Name */}
                        <Input
                            label="Full name"
                            placeholder="Alex Morgan"
                            icon={<User size={16} />}
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        {/* Username */}
                        <Input
                            label="Username"
                            placeholder="@alex.morgan"
                            icon={<AtSign size={16} />}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            rightText="Used to sign in"
                        />

                        {/* Password */}
                        <div>
                            <label className="font-medium text-sm mb-1 block">Password</label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a secure password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-10 xl:h-12 rounded-xl border border-gray-300 pl-12 pr-12 outline-none focus:border-indigo-500"
                                />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                <PasswordRule
                                    valid={passwordRules.length}
                                    text="At least 8 characters"
                                />

                                <PasswordRule
                                    valid={passwordRules.uppercase}
                                    text="One uppercase letter"
                                />

                                <PasswordRule
                                    valid={passwordRules.number}
                                    text="One number"
                                />

                                <PasswordRule
                                    valid={passwordRules.symbol}
                                    text="One symbol"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="font-medium text-sm block mb-2">Role</label>

                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full h-10 xl:h-12 rounded-xl border border-gray-300 pl-12 pr-5 outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select a role</option>
                                    <option>Admin</option>
                                    <option>Purchase Manager</option>
                                    <option>Purchase Senior Executive</option>
                                    <option>Purchase Executive</option>
                                    <option>Purchase Junior Executive</option>
                                    <option>Site Supervisor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-5 mt-8 xl:mt-10">
                        <button className="text-gray-600 font-medium">Cancel</button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-xl flex items-center gap-2">Create User<ArrowRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;