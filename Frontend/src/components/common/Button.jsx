import React from 'react'

const Button = ({ lable, icon, key, type, className = "", onClick, disabled }) => {

  return (
    <div>
      <button onClick={onClick} key={key} type={type} className={`${className}`} disabled={disabled}>{icon}{lable}</button>
    </div>
  )
}

export default Button