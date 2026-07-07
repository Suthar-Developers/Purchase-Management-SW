import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../../api/projectApi'
import Button from '../../components/common/Button'
import ProjectCreate from '../../components/models/ProjectCreate'
import ProjectView from '../../components/models/ProjectView'
import { exportPagePdf } from '../../utils/pagePdfExport'

const Projects = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)
    // Stores all projects selected by the user using checkboxes.
    // This list is used when downloading the PDF.
    const [selectedProjects, setSelectedProjects] = useState([]);
    // Controls whether the table is in selection mode.
    // false = Normal table (checkboxes hidden)
    // true  = Selection mode (checkboxes visible)
    const [isSelectionMode, setIsSelectionMode] = useState(false);
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
        return (
            project.projectName?.toLowerCase().includes(searchProject.toLowerCase()) ||
            project.projectCode?.toLowerCase().includes(searchProject.toLocaleLowerCase()) ||
            project.clientName?.toLowerCase().includes(searchProject.toLocaleLowerCase())
        )
    })
    // Download PDF
    //
    // First click:
    //     -> Enables selection mode (checkboxes appear)
    //
    // Second click:
    //     -> Downloads only the selected projects
    //     -> Hides checkboxes again
    const downloadProjectsPdf = () => {

    // First click
    if (!isSelectionMode) {
        setIsSelectionMode(true);
        return;
    }

    // User didn't select anything
    if (selectedProjects.length === 0) {
        alert("Please select at least one project.");
        return;
    }

    // Generate PDF
    exportPagePdf({
        title: 'Projects Data',
        fileName: 'projects-data',

        // Export only selected projects
        rows: selectedProjects,

        columns: [
            { label: 'Project Name', key: 'projectName' },
            { label: 'Project Code', key: 'projectCode' },
            { label: 'Client', key: 'clientName' },
            { label: 'State', key: 'state' },
            { label: 'City', key: 'city' },
            { label: 'Status', key: 'status' },

            {
                label: 'Start Date',
                render: (project) =>
                    project.startDate
                        ? formatDate(project.startDate)
                        : '-',
            },

            {
                label: 'End Date',
                render: (project) =>
                    project.endDate
                        ? formatDate(project.endDate)
                        : '-',
            },
        ],
    });

    // Reset selection mode after download
    setSelectedProjects([]);
    setIsSelectionMode(false);
 };
    return (
        <div className='main-screen h-screen bg-slate-200 overflow-hidden'>
            <div className='flex flex-col max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-hidden'>
                <h1 className='text-base font-bold px-6 py-2 shrink-0'>All Projects</h1>
                <div className='flex flex-wrap items-center gap-2 w-full px-6 text-center mb-3 shrink-0'>
                    <input
                        className='min-w-60 flex-1 rounded-lg px-4 py-2 bg-gray-100 text-black text-xs font-bold hover:bg-gray-200'
                        type="search"
                        name="ProjectSearch"
                        placeholder='Search projects...'
                        value={searchProject}
                        onChange={(e) => setSearchProject(e.target.value)}
                    />
                    <Button
                        icon={<i className="fa-solid fa-download"></i>}
                        onClick={downloadProjectsPdf}
                        className='grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:cursor-pointer'
                        title="Download projects PDF"
                        aria-label="Download projects PDF"
                    />
                    <Button lable='+ Add' className='w-25 px-6 py-2 text-white text-xs font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer' onClick={openModel} />
                </div>

                <div className='flex-1 overflow-auto rounded-lg'>
                    <div className='flex justify-around sticky top-0 z-20 rounded-t-lg text-xs font-medium bg-[#4b5ea3] text-white py-3 mx-2'>
                        {/* Selection Column */}
                        { (
                            <div className='w-1/20 flex justify-center'>
                                <input
                                    type="checkbox"
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
                        )}
                        
                        {/* Serial Number */}
                        <div className='w-1/15 text-center'>#</div>
                        
                        <div className='w-1/4'>Project Name</div>
                        <div className='w-1/4 text-center'>Project Code</div>
                        <div className='w-1/4 text-center'>State</div>
                        <div className='w-1/4 text-center'>City</div>
                        <div className='w-1/4 text-center'>Client Name</div>
                        <div className='w-1/4 text-center'>Start Date</div>
                        <div className='w-1/4 text-center'>End Date</div>
                        <div className='w-1/4 text-center'>Status</div>
                        <div className='w-1/4 text-center'>Updated On</div>
                        <div className='w-1/4 text-center'>Action</div>
                    </div>

                    {filteredProjects.map((project, index) => (
                        <div key={project.project_id} className='flex justify-around items-center py-3 mx-2 text-xs border-b border-slate-300'>
                            {/* Selection Column */}
                            { (
                                <div className='w-1/20 flex justify-center'>
                                    <input
                                        type="checkbox"
                                        checked={selectedProjects.some(
                                            item => item.project_id === project.project_id
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProjects([
                                                    ...selectedProjects,
                                                    project,
                                                ]);
                                            } else {
                                                setSelectedProjects(
                                                    selectedProjects.filter(
                                                        item => item.project_id !== project.project_id
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Serial Number */}
                            <div className='w-1/15 text-center'>
                                {index + 1}
                            </div>
                            <div className='w-1/4'>{project.projectName}</div>
                            <div className='w-1/4 text-center'>{project.projectCode}</div>
                            <div className='w-1/4 text-center'>{project.state}</div>
                            <div className='w-1/4 text-center'>{project.city}</div>
                            <div className='w-1/4 text-center'>{project.clientName}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.startDate)}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.endDate)}</div>
                            <div className='w-1/4 text-center'>{project.status}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.updated_at)}</div>
                            <div className='flex w-1/4 justify-center'>

                                <Button onClick={() => openView(project)} className="text-blue-700" icon={<i className="fa-notdog fa-solid fa-eye mr-3 hover:cursor-pointer hover:text-green-600 hover:scale-110"></i>} />
                                <Button onClick={() => handleEdit(project)} className="text-green-600" icon={<i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i>} />
                            </div>
                        </div>
                    ))}
                </div>

                <ProjectCreate isOpen={isModelOpen} onClose={closeModel} refreshProjects={getProjects} />

                {isViewModelOpen && (
                    <ProjectView project={selectedProject} onClose={closeView} refreshProjects={getProjects} startEditing={startEditing} />
                )}
            </div>
        </div>
    )
}

export default Projects
