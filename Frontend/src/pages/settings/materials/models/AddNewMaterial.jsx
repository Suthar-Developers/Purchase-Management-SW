import React, { useState } from "react"
import Button from "../../../../components/common/Button"
import { AddNewMaterial as createMaterial } from "../../../../api/materialListApi";

const AddNewMaterial = ({ onClose, refreshMaterials }) => {

    const [form, setForm] = useState({
        material_name: "",
        material_code: "",
        material_category: "",
        material_status: "Active"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await createMaterial(form);

            alert(data.message);

            setForm({
                material_name: "",
                material_code: "",
                material_category: "",
                material_status: "Active"
            });
            refreshMaterials();
            onClose()
        } catch (error) {
            console.error(error)
            alert("Error while creating new material")
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white w-175 rounded-2xl shadow-lg">
                <div className="border-b px-5 py-3 font-semibold">
                    Add Material
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-blue-700 font-semibold">
                            Material Name
                        </label>

                        <input
                            type="text"
                            name="material_name"
                            value={form.material_name}
                            placeholder="Material Name"
                            className="input-line"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-blue-700 font-semibold">
                            Material Code
                        </label>

                        <input
                            type="text"
                            name="material_code"
                            value={form.material_code}
                            placeholder="Material Code"
                            className="input-line"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-blue-700 font-semibold">
                            Category
                        </label>

                        <select
                            className="input-line"
                            name="material_category"
                            value={form.material_category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Ply Board">Ply Board</option>
                            <option value="Screw">Screw</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-blue-700 font-semibold">
                            Status
                        </label>

                        <select
                            className="input-line"
                            name="material_status"
                            value={form.material_status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4">
                    <Button onClick={onClose} className="px-6 py-2 bg-gray-200 text-xs rounded-lg justify-center hover:bg-gray-300 hover:cursor-pointer" lable={'Cancel'} />
                    <Button onClick={handleSubmit} className='w-25 px-6 py-2 font-medium bg-blue-600 text-xs rounded-lg justify-center hover:bg-blue-700 hover:cursor-pointer text-white' lable={'Add'} />
                </div>
            </div>
        </div>
    )
}

export default AddNewMaterial