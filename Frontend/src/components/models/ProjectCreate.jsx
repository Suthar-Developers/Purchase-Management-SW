import React from 'react'
import { useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import { State, City } from "country-state-city"
import { createProject } from '../../api/projectApi'


const ProjectCreate = ({ isOpen, onClose, refreshProjects }) => {
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

        secondaryContactPerson: {
            name: "",
            number: "",
            email: ""
        },

        projectManagerName: "",
        projectManagerNumber: "",
        projectManagerEmail: "",

        supervisorName: "",
        supervisorNumber: "",
        supervisorEmail: "",

        secondarySupervisors: [],

        status: "Planned",
        budget: "",
        description: ""
    });

    const [showContactPersonModal, setShowContactPersonModal] = useState(false);
    const [showProjectManagerModal, setShowProjectManagerModal] = useState(false);
    const [showSupervisorModal, setShowSupervisorModal] = useState(false);

    const [contactPersonForm, setContactPersonForm] = useState({
        name: "",
        number: "",
        email: ""
    });

    const [managerForm, setManagerForm] = useState({
        name: "",
        number: "",
        email: ""
    });

    const [supervisorForm, setSupervisorForm] = useState({
        name: "",
        number: "",
        email: ""
    });

    const [secondaryContactPerson, setSecondaryContactPerson] = useState({
        name: "",
        number: "",
        email: ""
    });

    const [secondarySupervisors, setSecondarySupervisors] = useState([]);

    const handleContactPersonChange = (e) => {
        setContactPersonForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSecondaryContactChange = (e) => {
        setSecondaryContactPerson((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const saveContactPerson = () => {
        if (!contactPersonForm.name.trim()) {
            alert("Please enter contact person name.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            contactPersonName: contactPersonForm.name,
            contactPersonNumber: contactPersonForm.number,
            contactPersonEmail: contactPersonForm.email,
            secondaryContactPerson
        }));

        setShowContactPersonModal(false);
    };

    const handleManagerChange = (e) => {
        setManagerForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const saveProjectManager = () => {
        if (!managerForm.name.trim()) {
            alert("Please enter Project Manager name.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            projectManagerName: managerForm.name,
            projectManagerNumber: managerForm.number,
            projectManagerEmail: managerForm.email
        }));

        setShowProjectManagerModal(false);
    };

    const handleSupervisorChange = (e) => {
        setSupervisorForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const saveSupervisor = () => {
        if (!supervisorForm.name.trim()) {
            alert("Please enter Supervisor name.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            supervisorName: supervisorForm.name,
            supervisorNumber: supervisorForm.number,
            supervisorEmail: supervisorForm.email,
            secondarySupervisors
        }));

        setShowSupervisorModal(false);
    };

    const addSecondarySupervisor = () => {
        setSecondarySupervisors((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: "",
                number: "",
                email: ""
            }
        ]);
    };

    const updateSecondarySupervisor = (id, field, value) => {
        setSecondarySupervisors((prev) =>
            prev.map((supervisor) =>
                supervisor.id === id
                    ? {
                        ...supervisor,
                        [field]: value
                    }
                    : supervisor
            )
        );
    };

    const removeSecondarySupervisor = (id) => {
        setSecondarySupervisors((prev) =>
            prev.filter((supervisor) => supervisor.id !== id)
        );
    };

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
            const res = await createProject(formData)

            alert(res?.message || "Project created successfully");

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
                secondaryContactPerson: {
                    name: "",
                    number: "",
                    email: ""
                },
                projectManagerName: "",
                projectManagerNumber: "",
                projectManagerEmail: "",
                supervisorName: "",
                supervisorNumber: "",
                supervisorEmail: "",
                secondarySupervisors: [],
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

    const inputStyle = "w-full rounded-lg border border-gray-300 px-4 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none";

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

            <div className="bg-white w-[75%] h-fit rounded-xl p-4">
                <Button
                    lable='Close'
                    className="bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-lg float-end hover:cursor-pointer hover:bg-sky-600"
                    onClick={onClose}
                />

                <div className="flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 space-y-2"
                    >
                        <h2 className="text-base pb-2 font-semibold text-gray-800">Create New Project</h2>

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

                            {/* Project Manager */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">
                                            Project Manager
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {formData.projectManagerName
                                                ? formData.projectManagerName
                                                : "No project manager added"}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        lable={
                                            formData.projectManagerName
                                                ? "Edit"
                                                : "Add Manager"
                                        }
                                        onClick={() => {
                                            setManagerForm({
                                                name: formData.projectManagerName || "",
                                                number: formData.projectManagerNumber || "",
                                                email: formData.projectManagerEmail || ""
                                            });

                                            setShowProjectManagerModal(true);
                                        }}
                                        className="rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-medium text-white hover:bg-indigo-700"
                                    />
                                </div>
                            </div>

                            {/* Supervisor */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">
                                            Supervisor
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {formData.supervisorName
                                                ? formData.supervisorName
                                                : "No supervisor added"}
                                        </p>

                                        {secondarySupervisors.length > 0 && (
                                            <p className="mt-1 text-[10px] text-indigo-500">
                                                + {secondarySupervisors.length} secondary supervisor
                                                {secondarySupervisors.length > 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        lable={
                                            formData.supervisorName
                                                ? "Edit"
                                                : "Add Supervisor"
                                        }
                                        onClick={() => {
                                            setSupervisorForm({
                                                name: formData.supervisorName || "",
                                                number: formData.supervisorNumber || "",
                                                email: formData.supervisorEmail || ""
                                            });

                                            setShowSupervisorModal(true);
                                        }}
                                        className="rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-700"
                                    />
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">
                                            Contact Person
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {formData.contactPersonName
                                                ? formData.contactPersonName
                                                : "No contact person added"}
                                        </p>

                                        {secondaryContactPerson.name && (
                                            <p className="mt-1 text-[10px] text-indigo-500">
                                                + 1 secondary contact person
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        lable={
                                            formData.contactPersonName
                                                ? "Edit"
                                                : "Add Contact Person"
                                        }
                                        onClick={() => {
                                            setContactPersonForm({
                                                name: formData.contactPersonName || "",
                                                number: formData.contactPersonNumber || "",
                                                email: formData.contactPersonEmail || ""
                                            });

                                            setSecondaryContactPerson(
                                                formData.secondaryContactPerson || {
                                                    name: "",
                                                    number: "",
                                                    email: ""
                                                }
                                            );

                                            setShowContactPersonModal(true);
                                        }}
                                        className="rounded-lg bg-gray-600 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-700"
                                    />
                                </div>
                            </div>

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
                        <Button
                            lable="Create Project"
                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 py-2 justify-center text-white text-xs font-medium hover:cursor-pointer hover:bg-indigo-800 transition"
                        />
                    </form>
                </div>
            </div>

            {/* CONTACT PERSON MODAL */}
            {showContactPersonModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    Contact Person Details
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add primary and secondary contact persons
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowContactPersonModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[65vh] overflow-y-auto p-5">

                            {/* Primary Contact Person */}
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Primary Contact Person
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                                        <input
                                            type="text"
                                            name="name"
                                            value={contactPersonForm.name}
                                            onChange={handleContactPersonChange}
                                            placeholder="contact person Name"
                                            className={inputStyle}
                                        />

                                        <input
                                            type="tel"
                                            name="number"
                                            value={contactPersonForm.number}
                                            onChange={handleContactPersonChange}
                                            placeholder="Contact Number"
                                            className={inputStyle}
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={contactPersonForm.email}
                                            onChange={handleContactPersonChange}
                                            placeholder="Email Address"
                                            className={inputStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Contact Person */}
                        <div className="max-h-[65vh] overflow-y-auto p-5">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                <div className="mb-3">
                                    <h4 className="text-sm font-semibold text-slate-800">
                                        Secondary Contact Person
                                    </h4>

                                    <p className="text-[11px] text-slate-400">
                                        Add one additional contact person if required
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={secondaryContactPerson.name}
                                            onChange={handleSecondaryContactChange}
                                            placeholder="Contact Person Name"
                                            className={inputStyle}
                                        />

                                        <input
                                            type="tel"
                                            name="number"
                                            value={secondaryContactPerson.number}
                                            onChange={handleSecondaryContactChange}
                                            placeholder="Contact Number"
                                            className={inputStyle}
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={secondaryContactPerson.email}
                                            onChange={handleSecondaryContactChange}
                                            placeholder="Email Address"
                                            className={inputStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">

                            <Button
                                type="button"
                                lable="Cancel"
                                onClick={() => setShowContactPersonModal(false)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            />

                            <Button
                                type="button"
                                lable="Save Contact Person"
                                onClick={saveContactPerson}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                            />

                        </div>
                    </div>
                </div>
            )}

            {/* PROJECT MANAGER MODAL */}
            {showProjectManagerModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    Project Manager Details
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add project manager
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowProjectManagerModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[65vh] overflow-y-auto p-5">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                <div className="mb-4">
                                    <p className="text-[11px] text-slate-400">
                                        The project manager responsible for this project
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={managerForm.name}
                                        onChange={handleManagerChange}
                                        placeholder="Project Manager Name"
                                        className={inputStyle}
                                    />

                                    <input
                                        type="tel"
                                        name="number"
                                        value={managerForm.number}
                                        onChange={handleManagerChange}
                                        placeholder="Contact Number"
                                        className={inputStyle}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={managerForm.email}
                                        onChange={handleManagerChange}
                                        placeholder="Email Address"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <Button
                                type="button"
                                lable="Cancel"
                                onClick={() => setShowProjectManagerModal(false)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            />

                            <Button
                                type="button"
                                lable="Save Project Manager"
                                onClick={saveProjectManager}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* SUPERVISOR MODAL */}
            {showSupervisorModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    Supervisor Details
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add primary and secondary supervisors
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSupervisorModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[65vh] overflow-y-auto p-5">

                            {/* Primary Supervisor */}
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Primary Supervisor
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        Main supervisor responsible for this project
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={supervisorForm.name}
                                        onChange={handleSupervisorChange}
                                        placeholder="Supervisor Name"
                                        className={inputStyle}
                                    />

                                    <input
                                        type="tel"
                                        name="number"
                                        value={supervisorForm.number}
                                        onChange={handleSupervisorChange}
                                        placeholder="Contact Number"
                                        className={inputStyle}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={supervisorForm.email}
                                        onChange={handleSupervisorChange}
                                        placeholder="Email Address"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Secondary Supervisors */}
                            <div className="mt-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">
                                            Secondary Supervisors
                                        </h4>

                                        <p className="text-[11px] text-slate-400">
                                            Add additional supervisors if required
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        lable="+ Add Supervisor"
                                        onClick={addSecondarySupervisor}
                                        className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-medium text-white hover:bg-blue-700"
                                    />
                                </div>

                                {secondarySupervisors.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                                        <p className="text-xs text-slate-400">
                                            No secondary supervisors added
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {secondarySupervisors.map(
                                            (supervisor, index) => (
                                                <div
                                                    key={supervisor.id}
                                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                                >

                                                    <div className="mb-3 flex items-center justify-between">
                                                        <p className="text-xs font-semibold text-slate-700">
                                                            Secondary Supervisor {index + 1}
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeSecondarySupervisor(supervisor.id)}
                                                            className="text-xs font-medium text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>

                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                        <input
                                                            type="text"
                                                            value={supervisor.name}
                                                            onChange={(e) => updateSecondarySupervisor(
                                                                supervisor.id,
                                                                "name",
                                                                e.target.value
                                                            )}
                                                            placeholder="Supervisor Name"
                                                            className={inputStyle}
                                                        />

                                                        <input
                                                            type="tel"
                                                            value={supervisor.number}
                                                            onChange={(e) => updateSecondarySupervisor(
                                                                supervisor.id,
                                                                "number",
                                                                e.target.value
                                                            )}
                                                            placeholder="Contact Number"
                                                            className={inputStyle}
                                                        />

                                                        <input
                                                            type="email"
                                                            value={supervisor.email}
                                                            onChange={(e) => updateSecondarySupervisor(
                                                                supervisor.id,
                                                                "email",
                                                                e.target.value
                                                            )}
                                                            placeholder="Email Address"
                                                            className={inputStyle}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <Button
                                type="button"
                                lable="Cancel"
                                onClick={() => setShowSupervisorModal(false)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            />

                            <Button
                                type="button"
                                lable="Save Supervisors"
                                onClick={saveSupervisor}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectCreate
