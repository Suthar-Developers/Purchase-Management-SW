import React, { useState, useEffect } from "react"
import Button from "../common/Button"
import { fetchMaterialsList, fetchUnitList } from "../../api/materialListApi";

const AddMaterials = ({ onClose, onSave }) => {

  const [materialsList, setMaterialsList] = useState([]);
  const [unitList, setUnitList] = useState([]);

  const [form, setForm] = useState({
    material: "",
    unit: "",
    category: "",
    qty: "",
    deliverBefore: ""
  });

  const getMaterialList = async () => {
      try {
        const data = await fetchMaterialsList();
  
        setMaterialsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterialsList([]);
      }
    };
  
    const getUnitList = async () => {
      try {
        const data = await fetchUnitList();
  
        setUnitList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch units:", error);
        setUnitList([]);
      }
    };
  
    useEffect(() => {
      getMaterialList();
      getUnitList();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When material changes
    if (name === "material") {
      const selectedMaterial = materialsList.find(
        (material) => material.material_name === value
      );

      setForm((prev) => ({
        ...prev,
        material: value,
        category: selectedMaterial?.material_category || "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-175 rounded-2xl shadow-lg">
        <div className="border-b px-5 py-3 font-semibold">
          Add Material
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <select
            name="material"
            className="w-full input-line"
            onChange={handleChange}
            value={form.material}
            required
          >
            <option value="" disabled>Select Material</option>
            {materialsList.map((m) => (
              <option key={m.material_id} value={m.material_name}>
                {m.material_name}
              </option>
            ))}
          </select>

          <select
            name="unit"
            className="w-full input-line"
            onChange={handleChange}
            value={form.unit}
            required
          >
            <option value="" disabled>Select Unit</option>
            {unitList.map((u) => (
              <option key={u.material_unit_id} value={u.material_unit}>
                {u.material_unit}
              </option>
            ))}
          </select>

          <input type="text" name="category" className="input-line" placeholder="Category" onChange={handleChange} value={form.category} readOnly required />

          <input name="qty" placeholder="Qty Required" className="input-line" onChange={handleChange} required/>

          <div>
            <label className="text-xs text-blue-700 font-semibold" htmlFor="deliveryDate">Deliver Before</label>
            <input type="date" name="deliverBefore" className="input-line" onChange={handleChange}/>
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

export default AddMaterials