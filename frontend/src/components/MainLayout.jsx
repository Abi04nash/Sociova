import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import MobileNavbar from './MobileNavbar'

const MainLayout = () => {
  return (
    <div className='Main'>
      <MobileNavbar />
      <LeftSidebar className="lefty"  />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout