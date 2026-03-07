import React from 'react'

const Button = ({lable, onClick}) => {
  return (
    <div>
      <button onClick={onClick} className='bg-sky-500 text-white font-bold px-10 py-3 rounded-lg hover:cursor-pointer'>{lable}</button>
    </div>
  )
}

export default Button
