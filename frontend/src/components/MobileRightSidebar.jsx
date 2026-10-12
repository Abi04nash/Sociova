import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Users,
  X // Added X icon here
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { clearNotifications } from '@/redux/rtnSlice';
import CreatePost from './CreatePost';
import MobileRightSidebar from './MobileRightSidebar';

const MobileSidebar = ({ closeSidebar }) => {
  const { user, suggestedUsers } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
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
        closeSidebar();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case 'Logout':
        logoutHandler();
        break;
      case 'Create':
        closeSidebar();
        setTimeout(() => setOpen(true), 300);
        break;
      case 'Profile':
        navigate(`/profile/${user?._id}`);
        closeSidebar();
        break;
      case 'Home':
        navigate('/');
        closeSidebar();
        break;
      case 'Messages':
        navigate('/chat');
        closeSidebar();
        break;
      case 'Notifications':
        toast.info('Notifications clicked');
        closeSidebar();
        break;
      case 'Suggested':
        closeSidebar();
        setTimeout(() => setShowSuggestedUsers(true), 300);
        break;
      default:
        toast.info(`${textType} clicked`);
        closeSidebar();
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home className="w-6 h-6 stroke-[1.5]" />, text: 'Home' },
    { icon: <Search className="w-6 h-6 stroke-[1.5]" />, text: 'Search' },
    { icon: <TrendingUp className="w-6 h-6 stroke-[1.5]" />, text: 'Explore' },
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
      <div className='flex flex-col h-full bg-white px-5 py-6'>
        
        {/* Brand Header with Cross aligned perfectly in parallel */}
        <div className='mb-8 px-2 flex items-center justify-between'>
            <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent w-fit'>
              Sociova
            </h1>
            <button 
                className="md:hidden p-2 bg-gray-50/80 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
                onClick={closeSidebar}
                aria-label="Close Menu"
            >
                <X size={20} strokeWidth={2.5} />
            </button>
        </div>

        {/* Navigation Menu */}
        <div className='flex-1 flex flex-col gap-1.5'>
            {sidebarItems.map((item, index) => {
                const isLogout = item.text === 'Logout';
                
                return (
                    <div
                        key={index}
                        className={`group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98]
                            ${isLogout 
                                ? 'mt-auto mb-4 bg-red-50/50 text-red-500 hover:bg-red-100 hover:text-red-600 border border-red-100' 
                                : 'text-gray-700 hover:bg-violet-50 hover:text-violet-600'
                            }
                        `}
                        onClick={() => sidebarHandler(item.text)}
                    >
                        <div className={`transition-transform duration-200 group-hover:scale-110 ${item.text === "Profile" ? 'group-hover:scale-105' : ''}`}>
                            {item.icon}
                        </div>
                        
                        <span className={`text-[16px] tracking-wide flex-1 ${isLogout ? 'font-bold' : 'font-semibold'}`}>
                            {item.text}
                        </span>

                        {/* Beautiful Notification Badge specific to Mobile */}
                        {item.text === 'Notifications' && likeNotification?.length > 0 && (
                            <span className="bg-pink-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-pink-500/30">
                                {likeNotification.length}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>

        <CreatePost open={open} setOpen={setOpen} />
      </div>

      {/* Right Sidebar for Suggested Users */}
      <MobileRightSidebar
        show={showSuggestedUsers}
        onClose={() => setShowSuggestedUsers(false)}
      />
    </>
  );
};

export default MobileSidebar;