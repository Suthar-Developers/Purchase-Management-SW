import React from 'react'

const Button = ({lable, onClick}) => {

  return (
    <div>
      <button onClick={onClick} className='px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-medium hover:cursor-pointer'>{lable}</button>
    </div>
  )
}

export default Button