import React, { useEffect, useState } from 'react'
import { fetchVendors } from '../../api/vendorApi'
import Button from '../../components/common/Button'
import VendorCreate from '../../components/models/VendorCreate'
import VendorView from '../../components/models/VendorView'

const Vendors = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [vendors, setVendors] = useState([])
    const [selectedVendors, setSelectedVendors] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)
    const [searchVendor, setSearchVendor] = useState('')

    const getVendors = async() => {
        try {
            const data = await fetchVendors()
            setVendors(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getVendors()
    }, [])

    const openModel = () => {
        setIsModelOpen(true)
    }
    const closeModel = () => {
        setIsModelOpen(false)
        setIsViewModelOpen(false)
    }

    const openView = (vendor) => {
        setIsViewModelOpen(true)
        setStartEditing(false)
        setSelectedVendors(vendor)
    }

    const closeView = () => {
        setSelectedVendors(null)
        setIsViewModelOpen(false)
    }

    const handleEdit = (vendor) => {
        setSelectedVendors(vendor)
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

    const filteredVendors = (vendors || []).filter((vendor) => {
        return (
            vendor.vendorName?.toLowerCase().includes(searchVendor.toLowerCase()) ||
            vendor.vendorType?.toLowerCase().includes(searchVendor.toLowerCase()) ||
            vendor.vendorTag?.toLowerCase().includes(searchVendor.toLowerCase())
        )
    })

    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>

            <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
                <h1 className='text-2xl font-bold p-6'>All Vendors</h1>
                <div className='flex justify-around w-full px-15 text-center mb-5'>
                    <input
                        className='rounded-lg px-4 py-2 bg-gray-100 text-black text-lg font-bold hover:bg-gray-200 w-full mr-5'
                        type="search"
                        name="VendorSearch"
                        placeholder='Search vendors...'
                        value={searchVendor}
                        onChange={(e) => setSearchVendor(e.target.value)}
                    />
                    <Button lable='Add' onClick={openModel} />
                </div>

                <div className='flex flex-col gap-3 w-full overflow-auto rounded-lg'>
                    <div className='flex justify-around rounded-t-lg text-ms font-medium bg-[#4b5ea3] text-white py-3 mx-2'>
                        <div className='w-1/12 text-center'>#</div>
                        <div className='w-1/4 text-center'>Vendor Name</div>
                        <div className='w-1/4 text-center'>Type</div>
                        <div className='w-1/4 text-center'>Vendor Tag</div>
                        <div className='w-1/4 text-center'>Location</div>
                        <div className='w-1/4 text-center'>Status</div>
                        <div className='w-1/4 text-center'>Updated On</div>
                        <div className='w-1/4 text-center'>Action</div>
                    </div>

                    {filteredVendors.map((vendor, index) => (
                        <div key={vendor.vendor_id} className='flex justify-around items-center pb-2 text-ms border-b border-slate-300'>
                            <div className='w-1/8 text-center'>{index + 1}</div>
                            <div className='w-1/4'>{vendor.vendorName}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorType}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorTag}</div>
                            <div className='w-1/4 text-center'>{vendor.location}</div>
                            <div className='w-1/4 text-center'>{vendor.status}</div>
                            <div className='w-1/4 text-center'>{formatDate(vendor.updated_at)}</div>
                            <div className='w-1/4 text-center'>
                                <button onClick={() => openView(vendor)} className="text-blue-700"><i className="fa-notdog fa-solid fa-eye mr-3 hover:cursor-pointer"></i></button>
                                <button onClick={() => handleEdit(vendor)} className="text-green-600"><i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i></button>
                            </div>
                        </div>
                    ))}
                </div>

                <VendorCreate isOpen={isModelOpen} onClose={closeModel} refreshVendors={getVendors} />

                {isViewModelOpen && (
                    <VendorView vendor={selectedVendors} onClose={closeView} refreshVendors={getVendors} startEditing={startEditing} />
                )}

            </div>
        </div>
    )
}

export default Vendors
