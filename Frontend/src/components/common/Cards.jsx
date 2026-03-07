import React from 'react'

const Cards = ({cardName, number, cardIcon}) => {
    return (
        <div className='flex justify-between items-center py-8 px-3 my-4 mx-1 rounded-xl bg-fuchsia-100 shadow-xl w-[30vh]'>
            <div className='flex flex-col ml-5 gap-2'>
                <h4 className='text-lg'>{cardName}</h4>
                <h1 className='text-2xl font-bold'>{number}</h1>
            </div>
        </div>
    )
}

export default Cards
