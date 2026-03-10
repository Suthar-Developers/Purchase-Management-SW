import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import SideNav from './components/common/SideNav'
import Header from './components/common/Header'
import Projects from './pages/project/Projects'
import ProjectCreate from './components/models/ProjectCreate'

const App = () => {
  return (
    <div className='flex overflow-hidden'>
      <SideNav />
      <div className='w-screen h-screen'>
        <Header />

        <div className='scroller w-full h-full overflow-y-auto'>

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/create-project' element={<ProjectCreate />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default App
