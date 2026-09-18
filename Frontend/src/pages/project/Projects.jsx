import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../../api/projectApi'
import Button from '../../components/common/Button'
import ProjectCreate from '../../components/models/ProjectCreate'
import ProjectView from '../../components/models/ProjectView'
import { exportProjectsPdf } from '../../utils/pagePdfExport'
import SearchInput from "../../components/common/SearchInput";
import useAuth from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';

const Projects = () => {
    const { user } = useAuth()
    const canCreate = hasPermission(user, 'projects', 'create')
    const canEdit = hasPermission(user, 'projects', 'edit')
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)

    // Stores all projects selected by the user using checkboxes.
    // This list is used when downloading the PDF.
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [searchProject, setSearchProject] = useState('');

    const getProjects = async () => {
        try {
            const data = await fetchProjects()
            setProjects(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const openModel = () => {
        setIsModelOpen(true)
    }

    const closeModel = () => {
        setIsModelOpen(false)
        setIsViewModelOpen(false)
    }

    const openView = (Project) => {
        setIsViewModelOpen(true)
        setStartEditing(false)
        setSelectedProject(Project)
    }

    const closeView = () => {
        setSelectedProject(null)
        setIsViewModelOpen(false)
    }

    const handleEdit = (project) => {
        setSelectedProject(project)
        setStartEditing(true)
        setIsViewModelOpen(true)
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredProjects = (projects || []).filter((project) => {
        const search = searchProject.trim().toLowerCase();

        if (!search) return true;

        return (
            project.projectName?.toLowerCase().includes(search) ||
            project.projectCode?.toLowerCase().includes(search) ||
            project.clientName?.toLowerCase().includes(search) ||
            project.state?.toLowerCase().includes(search) ||
            project.city?.toLowerCase().includes(search)
        );
    });

    const downloadProjectsPdf = () => {
        if (selectedProjects.length === 0) {
            alert("Please select at least one project.");
            return;
        }

        exportProjectsPdf({
            title: "Projects",
            fileName: "projects-data",
            rows: selectedProjects,
        });

        setSelectedProjects([]);
    };

    return (
        <div className="main-screen h-full overflow-hidden bg-slate-100">
            <div className="mx-3 my-2 flex h-[calc(100%-1.5rem)] min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {/* ===================== PAGE HEADER ===================== */}
                <div className="shrink-0 border-b border-slate-200 bg-white">
                    <div className="px-6 py-3.5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                    <i className="fa-solid fa-building text-base"></i>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                            Projects
                                        </h1>

                                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                                            {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Project overview, schedule, client and management information
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedProjects.length > 0 && (
                                    <div className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-semibold text-indigo-700 sm:flex">
                                        <i className="fa-solid fa-check-double"></i>
                                        {selectedProjects.length} selected
                                    </div>
                                )}

                                <Button
                                    icon={<i className="fa-solid fa-download text-xs"></i>}
                                    onClick={downloadProjectsPdf}
                                    className="flex h-9 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                />

                                {canCreate && (
                                    <Button
                                        lable="+ Add Project"
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                                        onClick={openModel}
                                    />
                                )}
                            </div>
                        </div>

                        {/* ===================== TOOLBAR ===================== */}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="min-w-65 flex-1">
                                <SearchInput
                                    value={searchProject}
                                    onChange={(e) => setSearchProject(e.target.value)}
                                    placeholder="Search by project name, code or client..."
                                    className="w-full"
                                    inputClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500">
                                <i className="fa-solid fa-list text-slate-400"></i>
                                <span>
                                    Showing{" "}
                                    <strong className="text-slate-700">
                                        {filteredProjects.length}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================== TABLE ===================== */}
                <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto bg-slate-50/70 px-3">
                    <div className="w-max min-w-full rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Table header */}
                        <div className="sticky top-0 z-30 grid grid-cols-[44px_44px_2.1fr_1.25fr_1.5fr_1.25fr_1.25fr_1.15fr_1.15fr_1fr_1.1fr_100px] items-center border-b border-slate-700 bg-slate-900 px-4 py-3 shadow-sm text-[9px] font-bold uppercase tracking-wider text-slate-300">
                            <div className="flex justify-center">
                                <input
                                    type="checkbox"
                                    className="h-3.5 w-3.5 cursor-pointer rounded border-slate-500 accent-indigo-500"
                                    checked={
                                        filteredProjects.length > 0 &&
                                        selectedProjects.length === filteredProjects.length
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedProjects(filteredProjects);
                                        } else {
                                            setSelectedProjects([]);
                                        }
                                    }}
                                />
                            </div>

                            <div className="text-center">#</div>
                            <div>Project</div>
                            <div>Code / Client</div>
                            <div>Location</div>
                            <div>Schedule</div>
                            <div>Project Manager</div>
                            <div>Supervisor</div>
                            <div>Contact</div>
                            <div>Status</div>
                            <div>Last Updated</div>
                            <div className="text-center">Action</div>
                        </div>

                        {/* Table body */}
                        {filteredProjects.length === 0 ? (
                            <div className="flex min-h-90 flex-col items-center justify-center px-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <i className="fa-solid fa-folder-open text-2xl"></i>
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-700">
                                    No projects found
                                </h3>

                                <p className="mt-1 max-w-md text-xs text-slate-400">
                                    {searchProject
                                        ? "No project matches your search. Try another project name, code or client."
                                        : "There are no projects available yet."}
                                </p>

                                {searchProject && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchProject("")}
                                        className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-200"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="min-h-0 flex-1 overflow-auto">
                                {filteredProjects.map((project, index) => {
                                    const isSelected = selectedProjects.some(
                                        (item) => item.project_id === project.project_id
                                    );

                                    const contacts = project.contacts || {};

                                    const manager =
                                        contacts.projectManager ||
                                        (project.projectManagerName
                                            ? {
                                                name: project.projectManagerName,
                                                phone: project.projectManagerNumber,
                                                email: project.projectManagerEmail,
                                            }
                                            : null);

                                    const supervisor =
                                        contacts.primarySupervisor ||
                                        (project.supervisorName
                                            ? {
                                                name: project.supervisorName,
                                                phone: project.supervisorNumber,
                                                email: project.supervisorEmail,
                                            }
                                            : null);

                                    const contact =
                                        contacts.primaryContactPerson ||
                                        (project.contactPersonName
                                            ? {
                                                name: project.contactPersonName,
                                                phone: project.contactPersonNumber,
                                                email: project.contactPersonEmail,
                                            }
                                            : null);

                                    const secondarySupervisorCount =
                                        contacts.secondarySupervisors?.length ??
                                        project.secondarySupervisors?.length ??
                                        0;

                                    const secondaryContactCount =
                                        contacts.secondaryContactPersons?.length ??
                                        (project.secondaryContactPerson?.name ? 1 : 0);

                                    const status = project.status || "Planned";

                                    const statusStyle =
                                        status === "Completed"
                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                            : status === "Started"
                                                ? "bg-blue-50 text-blue-700 ring-blue-100"
                                                : status === "Hold"
                                                    ? "bg-amber-50 text-amber-700 ring-amber-100"
                                                    : "bg-slate-100 text-slate-600 ring-slate-200";

                                    return (
                                        <div
                                            key={project.project_id}
                                            className={`min-w-375 grid grid-cols-[44px_44px_2.1fr_1.25fr_1.5fr_1.25fr_1.25fr_1.15fr_1.15fr_1fr_1.1fr_100px] items-center border-b border-slate-100 px-4 py-5 transition last:border-b-0 ${isSelected
                                                ? "bg-indigo-50/70"
                                                : "bg-white hover:bg-slate-50"
                                                }`}
                                        >
                                            {/* Selection */}
                                            <div className="flex justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 accent-indigo-600"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedProjects([
                                                                ...selectedProjects,
                                                                project,
                                                            ]);
                                                        } else {
                                                            setSelectedProjects(
                                                                selectedProjects.filter(
                                                                    (item) => item.project_id !== project.project_id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* Number */}
                                            <div className="text-center text-[10px] font-bold text-slate-400">
                                                {String(index + 1).padStart(2, "0")}
                                            </div>

                                            {/* Project */}
                                            <div className="min-w-0 pr-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                                                        {project.projectName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "P"}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-bold text-slate-800">
                                                            {project.projectName || "Unnamed Project"}
                                                        </p>

                                                        <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">
                                                            Project ID #{project.project_id}
                                                            {project.scopeOfWork
                                                                ? ` • ${project.scopeOfWork}`
                                                                : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Code + Client */}
                                            <div className="min-w-0 pr-4">
                                                <span className="inline-flex max-w-full truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600">
                                                    {project.projectCode || "—"}
                                                </span>

                                                <p className="mt-2 truncate text-[10px] font-medium text-slate-500">
                                                    <i className="fa-regular fa-building mr-1 text-slate-400"></i>
                                                    {project.clientName || "No client"}
                                                </p>
                                            </div>

                                            {/* Location */}
                                            <div className="min-w-0 pr-4">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {project.city || "—"}
                                                </p>

                                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                                    {project.state || "State not set"}
                                                    {project.stateCode
                                                        ? ` (${project.stateCode})`
                                                        : ""}
                                                </p>

                                                {project.address && (
                                                    <p className="mt-1 line-clamp-1 text-[9px] text-slate-400">
                                                        {project.address}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Schedule */}
                                            <div className="pr-4">
                                                <div className="flex items-center gap-2 text-[10px]">
                                                    <span className="rounded-md bg-emerald-50 px-1.5 py-1 font-semibold text-emerald-700">
                                                        {project.startDate
                                                            ? formatDate(project.startDate)
                                                            : "—"}
                                                    </span>
                                                </div>

                                                <div className="my-1.5 flex items-center gap-1 text-[9px] text-slate-300">
                                                    <span className="h-px flex-1 bg-slate-200"></span>
                                                    <i className="fa-solid fa-arrow-right"></i>
                                                    <span className="h-px flex-1 bg-slate-200"></span>
                                                </div>

                                                <div className="text-[10px]">
                                                    <span className="rounded-md bg-rose-50 px-1.5 py-1 font-semibold text-rose-600">
                                                        {project.endDate
                                                            ? formatDate(project.endDate)
                                                            : "—"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Project Manager */}
                                            <div className="min-w-0 pr-4">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {manager?.name || "Not assigned"}
                                                </p>

                                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                                    {manager?.phone || manager?.email || "No contact details"}
                                                </p>
                                            </div>

                                            {/* Supervisor */}
                                            <div className="min-w-0 pr-4">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {supervisor?.name || "Not assigned"}
                                                </p>

                                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                                    {supervisor?.phone || supervisor?.email || "No contact details"}
                                                </p>

                                                {secondarySupervisorCount > 0 && (
                                                    <span className="mt-1 inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-semibold text-sky-600">
                                                        +{secondarySupervisorCount} secondary
                                                    </span>
                                                )}
                                            </div>

                                            {/* Contact */}
                                            <div className="min-w-0 pr-4">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {contact?.name || "Not assigned"}
                                                </p>

                                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                                    {contact?.phone || contact?.email || "No contact details"}
                                                </p>

                                                {secondaryContactCount > 0 && (
                                                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-600">
                                                        +{secondaryContactCount} secondary
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-bold ring-1 ${statusStyle}`}
                                                >
                                                    <span className="mr-1.5 text-[7px]">●</span>
                                                    {status}
                                                </span>

                                                {project.budget !== null &&
                                                    project.budget !== undefined &&
                                                    project.budget !== "" && (
                                                        <p className="mt-2 text-[10px] font-semibold text-slate-500">
                                                            ₹ {Number(project.budget).toLocaleString("en-IN")}
                                                        </p>
                                                    )}
                                            </div>

                                            {/* Updated */}
                                            <div className="pr-2">
                                                <p className="text-[10px] font-semibold text-slate-600">
                                                    {project.updated_at
                                                        ? formatDate(project.updated_at)
                                                        : "—"}
                                                </p>

                                                <p className="mt-1 text-[9px] text-slate-400">
                                                    Last updated
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    onClick={() => openView(project)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                    icon={<i className="fa-solid fa-eye text-[11px]"></i>}
                                                />

                                                {canEdit && (
                                                    <Button
                                                        onClick={() => handleEdit(project)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                                                        icon={<i className="fa-solid fa-pen-to-square text-[11px]"></i>}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===================== FOOTER ===================== */}
                <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Project Management Workspace
                    </div>

                    <div className="text-[10px] text-slate-400">
                        {selectedProjects.length > 0
                            ? `${selectedProjects.length} project${selectedProjects.length > 1 ? "s" : ""} selected for export`
                            : "Select projects to export"}
                    </div>
                </div>

                {/* ===================== MODALS ===================== */}
                <ProjectCreate
                    isOpen={isModelOpen}
                    onClose={closeModel}
                    refreshProjects={getProjects}
                />

                {isViewModelOpen && (
                    <ProjectView
                        project={selectedProject}
                        onClose={closeView}
                        refreshProjects={getProjects}
                        startEditing={startEditing}
                    />
                )}
            </div>
        </div>
    )
}

export default Projects;