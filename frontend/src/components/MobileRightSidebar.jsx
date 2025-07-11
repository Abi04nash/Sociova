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
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    { icon: <Users />, text: 'Suggested' },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <>
      <div className='flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold mb-4 bg-gradient-to-l from-violet-500 to-pink-500 bg-clip-text text-transparent'>
          Sociova
        </h1>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className='flex items-center gap-3 p-2 rounded hover:bg-gray-200 cursor-pointer'
            onClick={() => sidebarHandler(item.text)}
          >
            {item.icon}
            <span className='text-base font-medium'>{item.text}</span>
          </div>
        ))}
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
