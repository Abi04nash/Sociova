import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Users, X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { clearNotifications } from '@/redux/rtnSlice';

// Sub-components
import CreatePost from './CreatePost';
import MobileRightSidebar from './MobileRightSidebar';
import SearchDialog from './SearchDialog';
import { Dialog, DialogContent } from './ui/dialog';

const MobileSidebar = ({ closeSidebar }) => {
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State handlers - explicitly separated to prevent loops
  const [open, setOpen] = useState(false); 
  const [searchOpen, setSearchOpen] = useState(false); 
  const [showNotifications, setShowNotifications] = useState(false); 
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(false); 

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://sociova.onrender.com/api/v1/user/logout', {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
        if (closeSidebar) closeSidebar();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const sidebarHandler = (textType) => {
    if (closeSidebar) closeSidebar(); // Close the menu immediately for all clicks

    switch (textType) {
      case 'Logout':
        logoutHandler();
        break;
      case 'Create':
        setTimeout(() => setOpen(true), 300);
        break;
      case 'Search': 
        setTimeout(() => setSearchOpen(true), 300);
        break;
      case 'Notifications': 
        setTimeout(() => setShowNotifications(true), 300);
        break;
      case 'Suggested':
        setTimeout(() => setShowSuggestedUsers(true), 300);
        break;
      case 'Profile':
        navigate(`/profile/${user?._id}`);
        break;
      case 'Home':
        navigate('/');
        break;
      case 'Messages':
        navigate('/chat');
        break;
      default:
        toast.info(`${textType} clicked`);
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home className="w-6 h-6 stroke-[1.5]" />, text: 'Home' },
    { icon: <Search className="w-6 h-6 stroke-[1.5]" />, text: 'Search' },
    // { icon: <TrendingUp className="w-6 h-6 stroke-[1.5]" />, text: 'Explore' },
    { icon: <MessageCircle className="w-6 h-6 stroke-[1.5]" />, text: 'Messages' },
    { icon: <Heart className="w-6 h-6 stroke-[1.5]" />, text: 'Notifications' },
    { icon: <PlusSquare className="w-6 h-6 stroke-[1.5]" />, text: 'Create' },
    { icon: <Users className="w-6 h-6 stroke-[1.5]" />, text: 'Suggested' },
    {
      icon: (
        <Avatar className="w-7 h-7 ring-2 ring-black/5 shadow-sm">
          <AvatarImage src={user?.profilePicture || defaultPlaceholder} className="object-cover" />
          <AvatarFallback>
            <img src={defaultPlaceholder} alt="fallback" className="object-cover w-full h-full" />
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut className="w-6 h-6 stroke-[1.5]" />, text: 'Logout' },
  ];

  return (
    <>
      <div className='flex flex-col h-[100dvh] max-h-screen bg-white px-5 py-6'>
        <div className='mb-8 px-2 flex items-center justify-between shrink-0'>
          <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent w-fit'>
            Sociova
          </h1>
          {closeSidebar && (
             <button
                className="md:hidden p-2 bg-gray-50/80 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
                onClick={closeSidebar}
             >
                <X size={20} strokeWidth={2.5} />
             </button>
          )}
        </div>

        <div className='flex-1 flex flex-col gap-1.5 overflow-y-auto overscroll-contain custom-scrollbar pb-6'>
          {sidebarItems.map((item, index) => {
            const isLogout = item.text === 'Logout';
            return (
              <div
                key={index}
                className={`group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                  isLogout
                    ? 'mt-auto mb-4 bg-red-50/50 text-red-500 hover:bg-red-100 hover:text-red-600 border border-red-100'
                    : 'text-gray-700 hover:bg-violet-50 hover:text-violet-600'
                }`}
                onClick={() => sidebarHandler(item.text)}
              >
                <div className={`transition-transform duration-200 group-hover:scale-110 ${item.text === "Profile" ? 'group-hover:scale-105' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[16px] tracking-wide flex-1 ${isLogout ? 'font-bold' : 'font-semibold'}`}>
                  {item.text}
                </span>
                {item.text === 'Notifications' && likeNotification?.length > 0 && (
                  <span className="bg-pink-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {likeNotification.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Unmounted components kept entirely separate from layout logic */}
        <CreatePost open={open} setOpen={setOpen} />
        <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
        <MobileRightSidebar show={showSuggestedUsers} onClose={() => setShowSuggestedUsers(false)} />
        
        {/* Notifications Modal */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent className="max-h-[85vh] w-[90vw] max-w-sm p-0 overflow-hidden rounded-3xl bg-white shadow-2xl border-0 md:hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
              <h2 className='text-lg font-extrabold text-gray-900'>Notifications</h2>
              <div className="flex items-center gap-2">
                  <button
                      className="text-xs px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full font-semibold hover:bg-violet-100 transition-colors"
                      onClick={() => dispatch(clearNotifications())}
                  >
                      Clear All
                  </button>
                  <button
                      className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-all duration-200 active:scale-95"
                      onClick={() => setShowNotifications(false)}
                  >
                      <X size={18} strokeWidth={2.5} />
                  </button>
              </div>
            </div>
            <div className="overflow-y-auto p-3 custom-scrollbar flex-1 bg-slate-50/30">
              {likeNotification.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center text-gray-400">
                      <Heart className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No new notifications</p>
                  </div>
              ) : (
                  likeNotification.map((notification, i) => (
                      <div key={i} className='flex items-center gap-3 p-3 my-1 rounded-xl bg-white border border-gray-100'>
                          <Avatar className="h-10 w-10">
                              <AvatarImage src={notification.userDetails?.profilePicture || defaultPlaceholder} className="object-cover" />
                          </Avatar>
                          <p className='text-sm text-gray-700'>
                              <span className='font-bold text-gray-900 mr-1'>
                                  {notification.userDetails?.username || "Deleted User"}
                              </span> 
                              {notification.type === 'message' ? 'sent you a message.' : 'liked your post.'}
                          </p>
                      </div>
                  ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default MobileSidebar;