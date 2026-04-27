import React from 'react'

const Button = ({ lable, type, className = "", onClick, disabled }) => {

  return (
    <div>
      <button onClick={onClick} type={type} className={`${className}`} disabled={disabled}>{lable}</button>
    </div>
  )
}

export default Button