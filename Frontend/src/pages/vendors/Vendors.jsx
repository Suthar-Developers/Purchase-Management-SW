import React, { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import VendorCreate from '../../components/models/VendorCreate'
import VendorView from '../../components/models/VendorView'
import axios from 'axios'

const Vendors = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [vendors, setVendors] = useState([])
    const [selectedVendors, setSelectedVendors] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const openModel = () => {
        setIsModelOpen(true)
    }
    const closeModel = () => {
        setIsModelOpen(false)
    }

    const openView = (Vendor) => {
        setIsViewModelOpen(true)
        setSelectedVendors(Vendor)
    }

    const closeView = () => {
        setIsViewModelOpen(false)
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchVendors = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/vendors')
            setVendors(res.data)
        } catch (error) {
            console.error("Error fetching vendors : ", error)
        }
    }

    useEffect(() => {
        fetchVendors()
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
                        <div className='w-1/12 text-center'>#</div>
                        <div className='w-1/4 text-center'>Vendor Name</div>
                        <div className='w-1/4 text-center'>Type</div>
                        <div className='w-1/4 text-center'>Vendor Tag</div>
                        <div className='w-1/4 text-center'>Location</div>
                        <div className='w-1/4 text-center'>Status</div>
                        <div className='w-1/4 text-center'>Updated On</div>
                        <div className='w-1/4 text-center'>Action</div>
                    </div>

                    {vendors.map((vendor, index) => (
                        <div key={vendor.id} className='flex justify-around items-center pb-2 text-lg border-b border-slate-300'>
                            <div className='w-1/8 text-center'>{index + 1}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorName}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorType}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorTag}</div>
                            <div className='w-1/4 text-center'>{vendor.location}</div>
                            <div className='w-1/4 text-center'>{vendor.status}</div>
                            <div className='w-1/4 text-center'>{formatDate(vendor.updated_at)}</div>
                            <div className='w-1/4 text-center'>
                                <button onClick={() => openView(vendor)}><i className="fa-notdog fa-solid fa-eye mr-2"></i></button>
                                <button><i className="fa-solid fa-pen-to-square ml-2"></i></button>
                            </div>
                        </div>
                    ))}
                </div>

                <VendorCreate isOpen={isModelOpen} onClose={closeModel} refreshVendors={fetchVendors} />

                {isViewModelOpen && (
                    <VendorView vendor={selectedVendors} onClose={closeView} />
                )}

            </div>
        </div>
    )
}

export default Vendors
