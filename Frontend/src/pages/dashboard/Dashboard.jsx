import React from 'react'
import Cards from '../../components/common/Cards'
import RecentItemList from '../../components/lists/RecentItemList'


const Dashboard = () => {
    return (
        <div className='w-full h-full bg-slate-200'>
            <h1 className='text-4xl font-bold mx-6 pt-6'>Dashboard</h1>
            <div className='flex flex-wrap w-full justify-around'>
                <Cards cardIcon={<i class="fa-solid fa-arrows-down-to-line fa-2xl"></i>} cardName="Total Received Indent" number="110" > </Cards>
                <Cards cardIcon={<i className="fa-solid fa-money-check fa-2xl"></i>} cardName="Pending Indent" number="100" > </Cards>
                <Cards cardIcon={<i class="fa-solid fa-exclamation fa-2xl"></i>} cardName="Pending Indent Items" number="100" > </Cards>
                <Cards cardIcon={<i class="fa-solid fa-calendar-check fa-2xl"></i>} cardName="Total PO Generated" number="110" > </Cards>
                <Cards cardIcon={<i className="fa-solid fa-clock-rotate-left fa-2xl"></i>} cardName="Pending PO" number="110" > </Cards>
                <Cards cardIcon={<i className="fa-solid fa-square-minus text-red-500 text-6xl"></i>} cardName="Pending PO Itmes" number="110" > </Cards>
            </div>

            <div>
                <RecentItemList />
            </div>
            
        </div>
    )
}

export default Dashboard
