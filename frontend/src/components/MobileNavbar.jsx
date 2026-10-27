import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './MobileNavbar.css'; 
import MobileSidebar from './MobileSidebar';

const MobileNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <h1 className="font-extrabold ml-3 text-2xl tracking-tight bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent select-none cursor-pointer">
          Sociova
        </h1>
        <button 
          onClick={() => setShowSidebar(true)}
          className="p-2 mr-3 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-full transition-all duration-200 active:scale-95"
          aria-label="Open Menu"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 md:hidden ${
            showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={() => setShowSidebar(false)}
      >
        <div
          className={`fixed top-0 left-0 w-[75%] sm:w-[320px] h-screen bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
              showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <button 
            className="absolute top-5 right-4 z-50 p-2 bg-gray-50/80 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
            onClick={() => setShowSidebar(false)}
            aria-label="Close Menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button> */}
          
          <div className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
            <MobileSidebar closeSidebar={() => setShowSidebar(false)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;