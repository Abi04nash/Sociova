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
  <Menu size={28} onClick={() => setShowSidebar(true)} />
</div>

<div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`} onClick={() => setShowSidebar(false)}>
  <div
    className={`slide-sidebar ${showSidebar ? 'show' : 'hide'}`}
    onClick={(e) => e.stopPropagation()}
  >
    <X size={24} className="close-icon" onClick={() => setShowSidebar(false)} />
    <MobileSidebar closeSidebar={() => setShowSidebar(false)} />
  </div>
</div>

    </>
  );
};

export default MobileNavbar;
