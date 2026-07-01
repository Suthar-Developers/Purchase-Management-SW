import React, { useEffect, useState } from 'react'
import { fetchVendors } from '../../api/vendorApi'
import Button from '../../components/common/Button'
import VendorCreate from '../../components/models/VendorCreate'
import VendorView from '../../components/models/VendorView'
import { exportPagePdf, filterRowsByDateRange } from '../../utils/pagePdfExport'

const Vendors = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [vendors, setVendors] = useState([])
    const [selectedVendors, setSelectedVendors] = useState(null)
    const [isViewModelOpen, setIsViewModelOpen] = useState(false)
    const [startEditing, setStartEditing] = useState(false)
    const [searchVendor, setSearchVendor] = useState('')
    const [downloadRange, setDownloadRange] = useState({ startDate: '', endDate: '' })

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

    const downloadVendorsPdf = () => {
        const rows = filterRowsByDateRange(filteredVendors, downloadRange.startDate, downloadRange.endDate, (vendor) => vendor.created_at || vendor.updated_at)
        exportPagePdf({
            title: 'Vendors Data',
            fileName: 'vendors-data',
            rows,
            startDate: downloadRange.startDate,
            endDate: downloadRange.endDate,
            columns: [
                { label: 'Vendor Name', key: 'vendorName' },
                { label: 'Type', key: 'vendorType' },
                { label: 'Tag', key: 'vendorTag' },
                { label: 'Email', key: 'vendorEmail' },
                { label: 'Contact', key: 'vendorContactNumber' },
                { label: 'Location', key: 'location' },
                { label: 'Status', key: 'status' },
                { label: 'Updated On', render: (vendor) => vendor.updated_at ? formatDate(vendor.updated_at) : '-' },
            ],
        })
    }

    return (
        <div className='main-screen w-full h-screen bg-slate-200 overflow-y-auto'>
            <div className='max-w-full h-[80%] bg-white m-5 rounded-2xl overflow-auto'>
                <h1 className='text-base font-bold px-6 py-2'>All Vendors</h1>
                <div className='flex flex-wrap w-full items-center gap-2 px-6 text-center mb-3'>
                    <input
                        className='min-w-60 flex-1 rounded-lg px-4 py-2 bg-gray-100 text-black text-xs font-bold hover:bg-gray-200'
                        type="search"
                        name="VendorSearch"
                        placeholder='Search vendors...'
                        value={searchVendor}
                        onChange={(e) => setSearchVendor(e.target.value)}
                    />
                    <input
                        type="date"
                        value={downloadRange.startDate}
                        onChange={(e) => setDownloadRange((current) => ({ ...current, startDate: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                        title="Download from date"
                    />
                    <input
                        type="date"
                        value={downloadRange.endDate}
                        onChange={(e) => setDownloadRange((current) => ({ ...current, endDate: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
                        title="Download to date"
                    />
                    <Button
                        icon={<i className="fa-solid fa-download"></i>}
                        onClick={downloadVendorsPdf}
                        className='grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:cursor-pointer'
                        title="Download vendors PDF"
                        aria-label="Download vendors PDF"
                    />
                    <Button lable='+ Add' className='w-25 px-6 py-2 text-white text-xs font-medium bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer' onClick={openModel} />
                </div>

                <div className='flex flex-col gap-3 w-full overflow-auto rounded-lg'>
                    <div className='flex justify-around rounded-t-lg text-xs font-medium bg-[#4b5ea3] text-white py-3 mx-2'>
                        <div className='w-1/8 text-center'>#</div>
                        <div className='w-1/4'>Vendor Name</div>
                        <div className='w-1/4 text-center'>Type</div>
                        <div className='w-1/4 text-center'>Vendor Tag</div>
                        <div className='w-1/4 text-center'>Location</div>
                        <div className='w-1/4 text-center'>Status</div>
                        <div className='w-1/4 text-center'>Updated On</div>
                        <div className='w-1/4 text-center'>Action</div>
                    </div>

                    {filteredVendors.map((vendor, index) => (
                        <div key={vendor.vendor_id} className='flex justify-around items-center pb-2 mx-2 text-xs border-b border-slate-300'>
                            <div className='w-1/8 text-center'>{index + 1}</div>
                            <div className='w-1/4'>{vendor.vendorName}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorType}</div>
                            <div className='w-1/4 text-center'>{vendor.vendorTag}</div>
                            <div className='w-1/4 text-center'>{vendor.location}</div>
                            <div className='w-1/4 text-center'>{vendor.status}</div>
                            <div className='w-1/4 text-center'>{formatDate(vendor.updated_at)}</div>
                            <div className='flex w-1/4 justify-center'>
                                <Button onClick={() => openView(vendor)} className="text-blue-700" icon={<i className="fa-notdog fa-solid fa-eye mr-3 hover:cursor-pointer hover:text-green-600 hover:scale-110"></i>} />
                                <Button onClick={() => handleEdit(vendor)} className="text-green-600" icon={<i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i>} />
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
