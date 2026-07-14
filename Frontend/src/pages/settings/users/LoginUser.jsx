import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import FeatureCard from "../../../components/common/FeatureCard";
import Input from "../../../components/common/Input";
import PasswordRule from "../../../components/common/PasswordRule";
import { loginUser } from "../../../api/userApi"
import { ArrowRight, AtSign, Eye, EyeOff, Lock, Shield, User } from "lucide-react";

const LoginUser = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            return alert("Please write username and password")
        }

        try {
            const data = await loginUser(formData);
            alert(data.message);
            
            navigate('/')

        } catch (error) {
            setLoginError(error.message)
        }
    }

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
                <div className="absolute inset-0 bg-linear-to-br from-[#060713] via-[#212549] to-[#0c0b20]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.72) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.62) 1px, transparent 1px)`, backgroundSize: "58px 58px", }}
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
                            Join the
                            <br />
                            workspace
                            <br />
                            in your system.
                        </h1>

                        <p className="text-gray-300 text-base leading-6 mt-5 max-w-md">
                            You can change your password after login.
                        </p>

                        {/* Feature Cards */}
                        <div className="space-y-2.5 mt-4">
                            <FeatureCard
                                title="Enterprise secure"
                                desc="End-to-end data protection"
                            />

                            <FeatureCard
                                title="Role-based access"
                                desc="Least privilege by default"
                            />

                            <FeatureCard
                                title="Easy collaboration"
                                desc="Work better together"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between mt-6 text-gray-400 text-sm">
                        <p>© {new Date().getFullYear()} Site Management System — All rights reserved.</p>

                        <div className="flex gap-8">
                            <button>Docs</button>
                            <button>Support</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex justify-center items-center bg-white px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-0 overflow-hidden">
                <form onSubmit={handleLogin} className="w-full max-w-md md:max-w-lg xl:max-w-xl flex flex-col justify-center">
                    <p className="uppercase text-indigo-600 tracking-widest font-semibold text-sm">Step 1 of 1</p>

                    <h1 className="text-[clamp(1rem,2vw,2rem)] font-bold text-slate-900 mt-3">Login with your username and password</h1>

                    <p className="text-gray-500 mt-1 text-lg">Login an account with assigned role.</p>

                    {loginError && (
                        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 text-sm text-red-600">
                            {loginError}
                        </div>
                    )}

                    <div className="space-y-3 mt-4">

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
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-5 mt-8 xl:mt-10">
                        <button type="button" className="text-gray-600 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-xl flex items-center gap-2">Login<ArrowRight size={18} /></button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginUser;