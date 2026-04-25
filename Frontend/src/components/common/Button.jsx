import React from 'react'

const Button = ({ lable, type, className = "", onClick}) => {

  return (
    <div>
      <button onClick={onClick} type={type} className={`${className}`}>{lable}</button>
    </div>
  )
}

export default Button