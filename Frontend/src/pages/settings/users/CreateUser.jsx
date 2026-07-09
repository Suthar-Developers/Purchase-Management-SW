import React, { useState } from "react";
import FeatureCard from "../../../components/common/FeatureCard";
import Input from "../../../components/common/Input";
import PasswordRule from "../../../components/common/PasswordRule";
import {
    ArrowRight,
    AtSign,
    Check,
    Eye,
    EyeOff,
    Lock,
    Shield,
    Square,
    User,
} from "lucide-react";

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
        <div className="flex flex-col lg:flex-row min-h-screen font-sans bg-white">
            {/* LEFT PANEL */}
            <div className="relative hidden lg:flex lg:w-2/5 xl:w-[42%] p-8 xl:p-10 2xl:p-14 min-h-screen overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 bg-linear-to-br from-[#10172B] via-[#171D39] to-[#2A2D63]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-15"
                    style={{backgroundImage: `linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)`, backgroundSize: "58px 58px",}}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between w-full p-10">

                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-white flex items-center justify-center">
                                <Square className="text-[#10172B]" fill="#10172B" size={18}/>
                            </div>

                            <div>
                                <h2 className="text-white text-xl xl:text-2xl 2xl:text-3xl font-bold leading-tight mt-10">JRC Interiors</h2>

                                <p className="uppercase tracking-[5px] text-indigo-300 text-xs mt-1">Team Management</p>
                            </div>
                        </div>

                        <h1 className="text-white text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mt-10">
                            Invite a new
                            <br />
                            member to your
                            <br />
                            workspace.
                        </h1>

                        <p className="text-gray-300 text-base xl:text-lg leading-7 mt-6 max-w-md">
                            Configure their identity, credentials and role.
                            They'll receive access as soon as you finish this form.
                        </p>

                        {/* Feature Cards */}
                        <div className="space-y-4 xl:space-y-5 mt-8">
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
                    <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 justify-between items-center mt-10 text-gray-400 text-sm">
                        <p>© 2026 JRC Interiors</p>

                        <div className="flex gap-8">
                            <button>Docs</button>
                            <button>Support</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex justify-center items-start lg:items-center bg-white px-4 sm:px-8 lg:px-10 py-10 lg:py-0">
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-2xl">
                    <p className="uppercase text-indigo-600 tracking-widest font-semibold text-sm">Step 1 of 1</p>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Create a new user</h1>

                    <p className="text-gray-500 mt-2 text-base sm:text-lg">Set up an account and assign a role.</p>

                    <div className="space-y-4 mt-4">
                        {/* Full Name */}
                        <Input
                            label="Full name"
                            placeholder="Alex Morgan"
                            icon={<User size={18} />}
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        {/* Username */}
                        <Input
                            label="Username"
                            placeholder="@alex.morgan"
                            icon={<AtSign size={18} />}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            rightText="Used to sign in"
                        />

                        {/* Password */}
                        <div>
                            <label className="font-medium text-sm mb-1 block">Password</label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a secure password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 md:h-14 rounded-xl border border-gray-300 pl-12 pr-12 outline-none focus:border-indigo-500"
                                />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
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
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full h-12 md:h-14 rounded-xl border border-gray-300 pl-12 pr-5 outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select a role</option>
                                    <option>Admin</option>
                                    <option>Purchase Manager</option>
                                    <option>Project Manager</option>
                                    <option>Store Manager</option>
                                    <option>Site Supervisor</option>
                                    <option>Account Manager</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10">
                        <button className="w-full sm:w-auto text-gray-600 font-medium py-3">Cancel</button>
                        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2">Create User<ArrowRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;