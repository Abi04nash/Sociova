import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Heart, Home, LogOut, MessageCircle, PlusSquare,
  Search, TrendingUp, Users,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { clearNotifications } from '@/redux/rtnSlice';
import { Button } from './ui/button';
import CreatePost from './CreatePost';
import { Dialog, DialogContent } from './ui/dialog';
import SuggestedUsers from './SuggestedUsers';

const MobileSidebar = ({ closeSidebar }) => {
  const { user, likeNotification } = useSelector((store) => ({
    user: store.auth.user,
    likeNotification: store.realTimeNotification.likeNotification
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // 👈 Add this

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
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case 'Logout': logoutHandler(); break;
      case 'Create': closeSidebar(); setTimeout(() => setOpen(true), 300); break;
      case 'Profile': navigate(`/profile/${user?._id}`); closeSidebar(); break;
      case 'Home': navigate('/'); closeSidebar(); break;
      case 'Messages': navigate('/chat'); closeSidebar(); break;
      case 'Notifications': closeSidebar(); setTimeout(() => setShowNotifications(true), 300); break; // 👈 fix
      case 'Suggested': closeSidebar(); setTimeout(() => setShowSuggested(true), 300); break;
      default: toast.info(`${textType} clicked`); closeSidebar(); break;
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    {
      icon: (
        <div className="relative">
          <Heart className="cursor-pointer" />
          {likeNotification.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs rounded-full px-2 py-[1px]">
              {likeNotification.length}
            </span>
          )}
        </div>
      ),
      text: 'Notifications',
    },
    { icon: <PlusSquare />, text: 'Create' },
    { icon: <Users />, text: 'Suggested' },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            <img
              src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
              alt=""
            />
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-l from-violet-500 to-pink-500 bg-clip-text text-transparent">
          Sociova
        </h1>

        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 cursor-pointer"
            onClick={() => sidebarHandler(item.text)}
          >
            {item.icon}
            <span className="text-base font-medium">{item.text}</span>
          </div>
        ))}

        <CreatePost open={open} setOpen={setOpen} />
      </div>

      {/* ✅ Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 md:hidden">
          <h2 className='text-lg font-bold mb-4'>Notifications</h2>
          <button
            className="text-sm border-2 border-violet-400 bg-violet-400 rounded-sm p-1 font-medium text-white hover:underline mb-3"
            onClick={() => dispatch(clearNotifications())}
          >
            Clear All
          </button>
          {likeNotification.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No new notifications</p>
          ) : (
            likeNotification.map((notification) => (
              <div key={notification.userId} className='flex items-center gap-2 my-2'>
                <Avatar>
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <p className='text-sm'>
                  <span className='font-bold'>{notification.userDetails?.username || "Deleted User"}</span> liked your post
                </p>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>

      {/* Suggested Users Modal */}
      <Dialog open={showSuggested} onOpenChange={setShowSuggested}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 md:hidden">
          <h2 className='text-lg font-bold mb-4'>Suggested for You</h2>
          <SuggestedUsers />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileSidebar;
