import React from 'react'

const Button = ({ lable, icon, type = "button", className = "", onClick, disabled, ...props }) => {

  return (
    <div>
      <button onClick={onClick} type={type} className={`${className}`} disabled={disabled} {...props}>{icon}{lable}</button>
    </div>
  )
}

export default Button
