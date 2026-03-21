import React, { useState, useEffect } from "react"
import { updateProject } from "../../api/projectApi"
import { State, City } from "country-state-city"
import Button from "../common/Button"

/* Reusable Field Component */

const formatDate = (dateStr) => {
  if (!dateStr) return ""

  const date = new Date(dateStr)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const Field = ({ label, name, value, isEditing, handleChange, options, type, formData, setFormData }) => {

  const boxStyle = "bg-gray-100 p-4 rounded-lg"
  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-2 py-1 mt-1"

  return (
    <div className={boxStyle}>

      <p className="text-gray-500 text-sm">{label}</p>

      {isEditing ? (

        type === "state" ? (
          <select
            value={value || ""}
            onChange={(e) => {
              const selectedState = State.getStatesOfCountry("IN").find(
                (s) => s.name === e.target.value
              )

              setFormData({
                ...formData,
                state: selectedState.name,
                stateCode: selectedState.isoCode, // 🔥 needed for city
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
        )

          /* ✅ CITY DROPDOWN */
          : type === "city" ? (
            <select
              value={value || ""}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={inputStyle}
              disabled={!formData.stateCode}
            >
              <option value="">Select City</option>

              {formData.stateCode &&
                City.getCitiesOfState("IN", formData.stateCode).map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </select>
          ) :

            options ? (

              <select
                name={name}
                value={value || ""}
                onChange={handleChange}
                className={inputStyle}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

            ) : type === "date" ? (

              <input
                type="date"
                name={name}
                value={value ? value.split("T")[0] : ""}
                onChange={handleChange}
                className={inputStyle}
              />

            ) : name === "projectCode" ? (

              <input
                value={value || ""}
                className={inputStyle}
                readOnly
              />

            ) : (

              <input
                name={name}
                value={value || ""}
                onChange={handleChange}
                className={inputStyle}
              />

            )

      ) : (

        type === "date"
          ? <p className="font-semibold text-gray-800">{formatDate(value)}</p>
          : <p className="font-semibold text-gray-800">{value}</p>

      )}

    </div>
  )
}

const ProjectView = ({ project, onClose, refreshProjects, startEditing }) => {

  if (!project) return null

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (project) {

      const stateObj = State.getStatesOfCountry("IN").find(
        (s) => s.name === project.state
      )

      setFormData({
        ...project,
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate),
        stateCode: stateObj?.isoCode || ""
      })

      setIsEditing(startEditing)
    }
  }, [project, startEditing])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdate = async () => {
    try {
      const res = await updateProject(formData.project_id, formData)

      alert(res?.message || "Project updated successfully")

      await refreshProjects()
      setIsEditing(false)
      onClose()

    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update project"
      )
    }
  }

  /* Field Configuration */

  const fields = [
    { label: "Project Name", name: "projectName" },
    { label: "Project Code", name: "projectCode" },
    { label: "Client Name", name: "clientName" },
    { label: "Project Area SQFT", name: "projectAreaSqft" },
    { label: "Scope of Work", name: "scopeOfWork" },
    { label: "Start Date", name: "startDate", type: "date" },
    { label: "End Date", name: "endDate", type: "date" },
    { label: "Contact Person Name", name: "contactPersonName" },
    { label: "Contact Person Number", name: "contactPersonNumber" },
    { label: "Contact Person Email", name: "contactPersonEmail" },
    { label: "Status", name: "status", options: ["Started", "Planned", "Completed", "Hold"] },
    { label: "Budget", name: "budget" },
    { label: "State", name: "state", type: "state" },
    { label: "City", name: "city", type: "city" },
    { label: "Address", name: "address" },
    { label: "Description", name: "description" }
  ]

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
        <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-3">
          Project Details
        </h2>

        {/* Fields Grid */}

        <div className="grid grid-cols-3 gap-3 text-lg">

          {fields.map((field) => (

            <Field
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              isEditing={isEditing}
              handleChange={handleChange}
              options={field.options}
              type={field.type}
              formData={formData}
              setFormData={setFormData}
            />

          ))}
        </div>

        {/* Buttons */}

        <div className="flex justify-end mt-8 gap-4">

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>

          {isEditing ? (

            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>

          ) : (

            <Button lable='Edit Project' onClick={() => setIsEditing(true)} />

          )}

        </div>

      </div>
    </div>
  )
}

export default ProjectView