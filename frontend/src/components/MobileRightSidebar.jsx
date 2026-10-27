import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { X } from 'lucide-react';
import SuggestedUsers from './SuggestedUsers'; // Assuming you have this component

const MobileRightSidebar = ({ show, onClose }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] w-[90vw] max-w-sm p-0 overflow-hidden rounded-3xl bg-white shadow-2xl border-0 md:hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
           <h2 className='text-lg font-extrabold text-gray-900'>Suggested for You</h2>
           <button 
               onClick={onClose}
               className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-all duration-200 active:scale-95"
           >
               <X size={18} strokeWidth={2.5} />
           </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-2 custom-scrollbar flex-1 bg-slate-50/30">
           <SuggestedUsers onClose={onClose} />
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default MobileRightSidebar;