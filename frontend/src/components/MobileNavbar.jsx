import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './MobileNavbar.css';
import MobileSidebar from './MobileSidebar';

const MobileNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="mobile-navbar">
        <h1 className="logo">Sociova</h1>
        <Menu className="hamburger-icon" size={28} onClick={() => setShowSidebar(true)} />
      </div>

      {/* Sidebar Slide In */}
      <div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`} onClick={() => setShowSidebar(false)}>
        <div className="slide-sidebar" onClick={(e) => e.stopPropagation()}>
          <X className="close-icon" size={24} onClick={() => setShowSidebar(false)} />
          <MobileSidebar closeSidebar={() => setShowSidebar(false)} />
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
