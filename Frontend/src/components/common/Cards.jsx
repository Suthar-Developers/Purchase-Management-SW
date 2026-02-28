import React from 'react'

const Cards = ({cardName, number, cardIcon}) => {
    return (
        <div className='flex justify-between items-center py-10 px-5 m-5 rounded-xl bg-white shadow-xl min-w-2/7'>
            <div className='flex flex-col ml-5 gap-2'>
                <h4 className='text-2xl'>{cardName}</h4>
                <h1 className='text-4xl font-bold'>{number}</h1>
            </div>
            <div className='text-3xl mr-5'>
                {cardIcon}
            </div>
        </div>
    )
}

export default Cards
