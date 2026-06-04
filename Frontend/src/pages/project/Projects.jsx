import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../../api/projectApi'
import Button from '../../components/common/Button'
import ProjectCreate from '../../components/models/ProjectCreate'
import ProjectView from '../../components/models/ProjectView'

const Projects = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)
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

    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>
            <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
                <h1 className='text-2xl font-bold p-6'>All Projects</h1>
                <div className='flex justify-around items-center w-full px-15 text-center mb-5'>
                    <input
                        className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-full mr-5'
                        type="search"
                        name="ProjectSearch"
                        placeholder='Search projects...'
                        value={searchProject}
                        onChange={(e) => setSearchProject(e.target.value)}
                    />
                    <Button lable='+ Add' className='w-25 px-6 py-2 font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer text-white' onClick={openModel} />
                </div>

                <div className='flex flex-col gap-3 w-full overflow-auto rounded-lg'>
                    <div className='flex justify-around rounded-t-lg text-ms font-medium bg-[#4b5ea3] text-white py-3 mx-2'>
                        <div className='w-1/8 text-center'>#</div>
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
                        <div key={project.project_id} className='flex justify-around items-center pb-2 text-ms border-b border-slate-300'>
                            <div className='w-1/8 text-center'>{index + 1}</div>
                            <div className='w-1/4'>{project.projectName}</div>
                            <div className='w-1/4 text-center'>{project.projectCode}</div>
                            <div className='w-1/4 text-center'>{project.state}</div>
                            <div className='w-1/4 text-center'>{project.city}</div>
                            <div className='w-1/4 text-center'>{project.clientName}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.startDate)}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.endDate)}</div>
                            <div className='w-1/4 text-center'>{project.status}</div>
                            <div className='w-1/4 text-center'>{formatDate(project.updated_at)}</div>
                            <div className='w-1/4 text-center'>
                                <button onClick={() => openView(project)} className="text-blue-700"><i className="fa-notdog fa-solid fa-eye mr-3 hover:cursor-pointer"></i></button>
                                <button onClick={() => handleEdit(project)} className="text-green-600"><i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i></button>
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
