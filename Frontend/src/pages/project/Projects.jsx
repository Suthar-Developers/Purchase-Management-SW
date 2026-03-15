import React, { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import ProjectCreate from '../../components/models/ProjectCreate'
import ProjectView from '../../components/models/ProjectView'
import axios from 'axios'

const Projects = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)

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

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/projects')
            setProjects(res.data)
        } catch (error) {
            console.error("Error fetching projects : ", error)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>

            <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
                <h1 className='text-2xl font-bold p-6'>All Projects</h1>
                <div className='flex justify-around w-full px-15 text-center mb-5'>
                    <input className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-full mr-5' type="search" name="ProjectSearch" placeholder='Search projects...' id="" />
                    <Button lable='Add' onClick={openModel} />
                </div>

                <div className='flex flex-col gap-3 w-full overflow-auto rounded-3xl'>
                    <div className='flex justify-around text-xl font-bold bg-slate-200 py-3 mx-2'>
                        <div className='w-1/8 text-center'>#</div>
                        <div className='w-1/4 text-center'>Project Name</div>
                        <div className='w-1/4 text-center'>Project Code</div>
                        <div className='w-1/4 text-center'>Client Name</div>
                        <div className='w-1/4 text-center'>Start Date</div>
                        <div className='w-1/4 text-center'>End Date</div>
                        <div className='w-1/4 text-center'>Status</div>
                        <div className='w-1/4 text-center'>Updated On</div>
                        <div className='w-1/4 text-center'>Action</div>
                    </div>

                    {projects.map((project, index) => (
                        <div key={project.project_id} className='flex justify-around items-center pb-2 text-lg border-b border-slate-300'>
                            <div className='w-1/8 text-center'>{index + 1}</div>
                            <div className='w-1/4 text-center'>{project.projectName}</div>
                            <div className='w-1/4 text-center'>{project.projectCode}</div>
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

                <ProjectCreate isOpen={isModelOpen} onClose={closeModel} refreshProjects={fetchProjects} />

                {isViewModelOpen && (
                    <ProjectView project={selectedProject} onClose={closeView} refreshProjects={fetchProjects} startEditing={startEditing} />
                )}

            </div>
        </div>
    )
}

export default Projects
