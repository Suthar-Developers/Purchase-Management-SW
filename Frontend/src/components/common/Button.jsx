import React from 'react'

const Button = ({ lable, className = "", onClick}) => {

  return (
    <div>
      <button onClick={onClick} className={`${className}`}>{lable}</button>
    </div>
  )
}

export default Button