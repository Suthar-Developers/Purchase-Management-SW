import React, { useEffect, useState } from 'react'
import axios from 'axios'

const SiteTable = ({ view, edit }) => {
    const [sites, setSites] = useState([])

    useEffect(() => {
        fetchSites()
    }, [])

    const fetchSites = async () => {
        try {
            const res = await axios.get('http://localhost:3000/sites')
            setSites(res.data)
        } catch (error) {
            console.error("Error fetching sites : ", error)
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className='flex flex-col gap-3 w-full overflow-auto'>
            <div className='flex justify-around text-xl font-bold bg-slate-200 py-3 mx-2'>
                <div className='w-1/8 text-center'>#</div>
                <div className='w-1/4 text-center'>Site Name</div>
                <div className='w-1/4 text-center'>Code</div>
                <div className='w-1/4 text-center'>Project Manager</div>
                <div className='w-1/4 text-center'>Start Date</div>
                <div className='w-1/4 text-center'>End Date</div>
                <div className='w-1/4 text-center'>Action</div>
            </div>

            {sites.map((site) => (
                <div key={site.id} className='flex justify-around items-center pb-2 text-lg border-b border-slate-300'>
                    <div className='w-1/8 text-center'>{site.id}</div>
                    <div className='w-1/4 text-center'>{site.siteName}</div>
                    <div className='w-1/4 text-center'>{site.siteCode}</div>
                    <div className='w-1/4 text-center'>{site.projectManager}</div>
                    <div className='w-1/4 text-center'>{formatDate(site.startDate)}</div>
                    <div className='w-1/4 text-center'>{formatDate(site.endDate)}</div>
                    <div className='w-1/4 text-center'><a href="/site-edit-form">{view} {edit}</a></div>
                </div>
            ))}
        </div>
    )
}

export default SiteTable
