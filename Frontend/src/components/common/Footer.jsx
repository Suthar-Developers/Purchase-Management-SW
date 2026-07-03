import React from "react"

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-4 text-center text-xs text-slate-500 lg:px-8">
      © {new Date().getFullYear()} Site Management System — All rights reserved.
    </footer>
  )
}

export default Footer