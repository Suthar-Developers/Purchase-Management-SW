import React from "react"

const ProjectView = ({ project, onClose }) => {

  if (!project) return null

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

      <div className="bg-white w-[70%] rounded-2xl shadow-2xl p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          Project Details
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 text-lg">

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Project Name</p>
            <p className="font-semibold text-gray-800">{project.projectName}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Projects Code</p>
            <p className="font-semibold text-gray-800">{project.projectCode}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Project Manager</p>
            <p className="font-semibold text-gray-800">{project.projectManager}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="font-semibold text-gray-800">
              {formatDate(project.startDate)}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">End Date</p>
            <p className="font-semibold text-gray-800">
              {formatDate(project.endDate)}
            </p>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8 gap-4">

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Project
          </button>

        </div>

      </div>
    </div>
  )
}

export default ProjectView