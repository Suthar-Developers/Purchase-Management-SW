import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { State, City } from "country-state-city"


const ProjectCreate = ({ isOpen, onClose, refreshProjects }) => {
    if (!isOpen) return null

    const [formData, setFormData] = useState({
        projectName: "",
        projectCode: "",
        clientName: "",
        projectAreaSqft: "",
        scopeOfWork: "",
        state: "",
        stateCode: "",
        city: "",
        address: "",
        startDate: "",
        endDate: "",
        contactPersonName: "",
        contactPersonNumber: "",
        contactPersonEmail: "",
        status: "Planned",
        budget: "",
        description: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateProjectCode = (stateCode, projectName) => {
        if (!stateCode || !projectName) return ""

        // Company → remove spaces & uppercase
        const companyPart = "JRC";

        // Year → last 2 digits
        const yearPart = new Date().getFullYear().toString().slice(-2)

        // Project → first letters
        const projectPart = projectName
            .trim()
            .split(" ")
            .filter(word => word.length > 0)
            .map(word => word[0])
            .join("")
            .toUpperCase()

        return `${companyPart}-${stateCode}-${yearPart}-${projectPart}`
    }

    useEffect(() => {
    const code = generateProjectCode(
        formData.stateCode,
        formData.projectName
    )

    setFormData((prev) => ({
        ...prev,
        projectCode: code
    }))
}, [formData.stateCode, formData.projectName])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Project Data:", formData);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/createProject", formData
            )

            alert(res.data.message);

            setFormData({
                projectName: "",
                projectCode: "",
                clientName: "",
                projectAreaSqft: "",
                scopeOfWork: "",
                state: "",
                stateCode: "",
                city: "",
                address: "",
                startDate: "",
                endDate: "",
                contactPersonName: "",
                contactPersonNumber: "",
                contactPersonEmail: "",
                status: "Planned",
                budget: "",
                description: ""
            })

            refreshProjects()
            onClose()

        } catch (error) {
            console.error(error)
            alert("Error while creating project")
        }
    };

    const inputStyle =
        "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

            <div className="bg-white w-[80%] h-[90%] rounded-xl p-6">
                <button
                    className="bg-sky-500 text-white font-bold px-10 py-3 rounded-lg float-end"
                    onClick={onClose}>Close
                </button>

                <div>

                    <div className="flex items-center justify-center p-4">
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Create New Project
                            </h2>

                            {/* Grid Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="projectName"
                                    placeholder="Project Name"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />

                                <input
                                    type="text"
                                    name="projectCode"
                                    placeholder="Project Code"
                                    value={formData.projectCode || ""}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    readOnly
                                    required
                                />

                                <input
                                    type="text"
                                    name="clientName"
                                    placeholder="Client Name"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="number"
                                    name="projectAreaSqft"
                                    placeholder="Project Area Sqft"
                                    value={formData.projectAreaSqft}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="text"
                                    name="scopeOfWork"
                                    placeholder="Scope of Work"
                                    value={formData.scopeOfWork}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="tel"
                                    name="contactPersonName"
                                    placeholder="Contact Person Name"
                                    value={formData.contactPersonName}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="tel"
                                    name="contactPersonNumber"
                                    placeholder="Contact Person Number"
                                    value={formData.contactPersonNumber}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="tel"
                                    name="contactPersonEmail"
                                    placeholder="Contact Person Email"
                                    value={formData.contactPersonEmail}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />

                                <input
                                    type="number"
                                    name="budget"
                                    placeholder="Budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />


                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputStyle}
                                >
                                    <option>Completed</option>
                                    <option>Hold</option>
                                    <option>Planned</option>
                                    <option>Started</option>
                                </select>

                                <select
                                    value={formData.state}
                                    onChange={(e) => {
                                        const selectedState = State.getStatesOfCountry("IN").find(
                                            (s) => s.name === e.target.value
                                        )

                                        setFormData({
                                            ...formData,
                                            state: selectedState.name,
                                            stateCode: selectedState.isoCode, // 🔥 store this
                                            city: "" // reset city
                                        })
                                    }}
                                    className={inputStyle}
                                >
                                    <option value="">Select State</option>

                                    {State.getStatesOfCountry("IN").map((state) => (
                                        <option key={state.isoCode} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                    disabled={!formData.stateCode}
                                    className={inputStyle}
                                >
                                    <option value="">Select City</option>

                                    {formData.stateCode &&
                                        City.getCitiesOfState("IN", formData.stateCode).map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Address */}
                            <textarea
                                name="address"
                                placeholder="Project Address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`${inputStyle}`}
                            />

                            {/* Description */}
                            <textarea
                                name="description"
                                placeholder="Project Description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${inputStyle}`}
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProjectCreate
