import React from 'react'

const Button = ({ lable, icon, type, className = "", onClick, disabled }) => {

  return (
    <div>
      <button onClick={onClick} type={type} className={`${className}`} disabled={disabled}>{icon}{lable}</button>
    </div>
  )
}

export default Button