import React from "react"

const Footer = () => {
  return (
    <footer className="w-full absolute bottom-0 left-0 bg-slate-900 text-gray-100 text-sm py-3 text-center border-t">
      © {new Date().getFullYear()} Site Management System — All rights reserved.
    </footer>
  )
}

export default Footer