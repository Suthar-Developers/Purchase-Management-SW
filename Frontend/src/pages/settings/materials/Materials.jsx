import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button'
import SearchInput from "../../../components/common/SearchInput";
import AddNewMaterial from './models/AddNewMaterial';
import { fetchMaterialsList } from '../../../api/materialListApi';

const Materials = () => {
  const navigate = useNavigate();

  const [isModelOpen, setIsModelOpen] = useState(false)
  const [material, setMaterial] = useState([])
  const [searchMaterial, setSearchMaterial] = useState('');

  const getMaterialsList = async () => {
    try {
      const data = await fetchMaterialsList()
      setMaterial(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getMaterialsList()
  }, [])

  const openModel = () => {
    setIsModelOpen(true)
  }

  const closeModel = () => {
    setIsModelOpen(false)
  }

  const filteredMaterials = (material || []).filter((m) => {
    return (
      m.material_name?.toLowerCase().includes(searchMaterial.toLowerCase()) ||
      m.material_code?.toLowerCase().includes(searchMaterial.toLocaleLowerCase())
    )
  })

  return (
    <div className='main-screen h-full bg-slate-200 overflow-hidden'>
      <div className='flex flex-col h-[95%] bg-white m-5 rounded-2xl overflow-hidden'>
        <h1 className='text-base font-bold px-6 py-2 shrink-0'>All Materials</h1>
        <div className='flex flex-wrap items-center gap-2 w-full px-6 text-center mb-3 shrink-0'>
          <SearchInput
            value={searchMaterial}
            onChange={(e) => setSearchMaterial(e.target.value)}
            placeholder="Search materials..."
            className="min-w-60 flex-1"
            inputClassName="w-full rounded-lg px-4 py-2 bg-gray-200 text-black text-xs font-bold hover:bg-gray-300 outline-none"
          />

          <Button lable='+ Add' className='px-6 py-2 text-white text-xs font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer' onClick={openModel} />
        </div>

        <div className='flex-1 overflow-auto rounded-lg'>
          <div className='flex justify-around sticky top-0 z-20 rounded-t-lg text-xs font-medium bg-[#4b5ea3] text-white py-3 mx-2'>

            {/* Serial Number */}
            <div className='w-1/15 text-center'>#</div>
            <div className='w-1/4'>Material</div>
            <div className='w-1/4 text-center'>Material Code</div>
            <div className='w-1/4 text-center'>Category</div>
            <div className='w-1/4 text-center'>Status</div>
            <div className='w-1/4 text-center'>Action</div>
          </div>

          {filteredMaterials.map((material, index) => (
            <div key={material.material_id} className='flex justify-around items-center py-1 mx-2 text-xs border-b border-slate-300'>

              {/* Serial Number */}
              <div className='w-1/15 text-center'>{index + 1}</div>
              <div className='w-1/4'>{material.material_name}</div>
              <div className='w-1/4 text-center'>{material.material_code}</div>
              <div className='w-1/4 text-center'>{material.material_category}</div>
              <div className='w-1/4 text-center'>{material.material_status}</div>
              <div className='flex w-1/4 justify-center'>
                <Button onClick={() => handleEdit(material)} className="text-green-600" icon={<i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i>} />
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-2 border-t flex justify-end">
          <Button
            lable="Back"
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 text-xs rounded-lg hover:bg-gray-300 hover:cursor-pointer"
          />
        </div>

        {isModelOpen && (
          <AddNewMaterial onClose={closeModel} refreshMaterials={getMaterialsList} />
        )}
      </div>
    </div>
  )
}

export default Materials