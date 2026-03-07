import React from 'react'
import Cards from '../../components/common/Cards'
import RecentItemList from '../../components/lists/RecentItemList'


const Dashboard = () => {

    return (
        <div className='flex w-full border-b border-gray-500'>
            <div className='w-3/8 h-full border-r border-gray-500 px-2'>
                <h1 className='text-2xl font-bold mx-6 mb-3 text-center pt-6'>Dashboard</h1>
                <div className='flex flex-wrap w-full justify-around'>
                    <Cards cardName="Fresh PR" number="110" > </Cards>
                    <Cards cardName={<span className='text-sm'><span className='text-lg'>Approved PR </span>(Pending for PO)</span>} number="100" > </Cards>
                    <Cards cardName="PO for Approval" number="100" > </Cards>
                    <Cards cardName="Total PO Generated" number="110" > </Cards>
                    <Cards cardName="Pending PR Items" number="110" > </Cards>
                    <Cards cardName="Pending PO Itmes" number="110" > </Cards>
                </div>
            </div>

            <div className='w-2/3'>
                <RecentItemList />
            </div>
        </div>
    )
}

export default Dashboard
