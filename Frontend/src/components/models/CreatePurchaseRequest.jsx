import { useEffect, useState } from "react"
import { fetchProjects } from "../../api/projectApi"
import { createPurchaseRequest } from "../../api/purchaseRequestApi"
import AddMaterials from "./AddMaterials"
import Button from "../common/Button"

const CreatePurchaseRequest = ({ onBack, onSave }) => {

  const [materials, setMaterials] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({
    project_id: "",
    contactPerson: "",
    contactInfo: "",
    deliverBefore: "",
    requestStatus: "Requested"
  });

  const getProjects = async () => {
    try {
      const data = await fetchProjects();

      setProjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_id) {
      return alert("Please select a project");
    }

    if (materials.length === 0) {
      return alert("Please add at least one material");
    }

    try {
      const data = await createPurchaseRequest({ ...form, materials });

      alert(data.message);

      setForm({
        project_id: "",
        contactPerson: "",
        contactInfo: "",
        deliverBefore: "",
        requestStatus: "Requested"
      });
      setMaterials([]);
      onBack()

    } catch (error) {
      console.error(error)
      alert("Error while creating purchase request")
    }
  };

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div className="w-full h-full bg-slate-200 p-4">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Create Purchase Request
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="px-6 py-4 grid grid-cols-4 gap-6">

            <div>
              <label className="text-sm text-gray-500">Project</label>
              <select
                name="project_id"
                className="input-line"
                onChange={handleChange}
                value={form.project_id}
              >

                <option value="" disabled>Select Project</option>

                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500">Contact Person</label>
              <input name="contactPerson" className="input-line" onChange={handleChange} value={form.contactPerson} required />
            </div>

            <div>
              <label className="text-sm text-gray-500">Contact No./Email</label>
              <input name="contactInfo" className="input-line" onChange={handleChange} value={form.contactInfo} required />
            </div>

            <div>
              <label className="text-sm text-gray-500">Deliver Before</label>
              <input className="input-line" type="date" name="deliverBefore" value={form.deliverBefore} onChange={handleChange} required />

            </div>

          </div>

          {/* TABLE */}
          <div className="flex-1 overflow-auto rounded-lg">

            <table className="w-full text-sm">

              <thead className="bg-[#4b5ea3] text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Material</th>
                  <th className="p-3 text-left">Specification</th>
                  <th className="p-3 text-left">Make</th>
                  <th className="p-3 text-left">Qty Required</th>
                  <th className="p-3 text-left">Is NT Item</th>
                  <th className="p-3 text-left">BOQ Ref No</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Attachment</th>
                </tr>
              </thead>

              <tbody>

                {materials.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        📦
                        <p>No materials added</p>
                        <p className="text-xs">Click "Add Material" to add</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materials.map((m, i) => {
                    return (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{m.material}</td>
                        <td className="p-3">{m.specification}</td>
                        <td className="p-3">{m.make}</td>
                        <td className="p-3">{m.qty}</td>
                        <td className="p-3">{m.isNtItem}</td>
                        <td className="p-3">{m.boqRef}</td>
                        <td className="p-3">{m.category}</td>
                        <td className="p-3">📎</td>
                      </tr>
                    )
                  })
                )}

              </tbody>
            </table>

          </div>

          {/* FOOTER */}
          <div className="px-6 mb-25 py-4 border-t flex justify-between">

            <Button lable="Add Material" type="button" onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-[#3c4e8f] text-white rounded-lg hover:bg-[#2f4180] hover:cursor-pointer" />

            <div className="flex space-x-3">
              <Button lable="Save" type="submit" disabled={materials.length === 0} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:cursor-pointer" />
              <Button lable="Back" type="button" onClick={onBack} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer" />
            </div>

          </div>
        </form>
      </div>


      {/* MODAL */}
      {
        isModalOpen && (
          <AddMaterials
            onClose={() => setIsModalOpen(false)}
            onSave={(data) => {
              setMaterials((prev) => [...prev, data])
              setIsModalOpen(false)
            }}
          />
        )
      }

    </div >
  )
}

export default CreatePurchaseRequest