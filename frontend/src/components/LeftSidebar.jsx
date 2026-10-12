import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { clearNotifications } from '@/redux/rtnSlice';

const LeftSidebar = ({ closeSidebar }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://sociova.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Home className="w-6 h-6 stroke-[1.5]" />, text: "Home" },
        { icon: <Search className="w-6 h-6 stroke-[1.5]" />, text: "Search" },
        { icon: <TrendingUp className="w-6 h-6 stroke-[1.5]" />, text: "Explore" },
        { icon: <MessageCircle className="w-6 h-6 stroke-[1.5]" />, text: "Messages" },
        { icon: <Heart className="w-6 h-6 stroke-[1.5]" />, text: "Notifications" },
        { icon: <PlusSquare className="w-6 h-6 stroke-[1.5]" />, text: "Create" },
        {
            icon: (
                <Avatar className="w-7 h-7 ring-1 ring-black/5 shadow-sm">
                    <AvatarImage src={user?.profilePicture || defaultPlaceholder} alt="profile" className="object-cover" />
                    <AvatarFallback>
                        <img src={defaultPlaceholder} alt="fallback" className="object-cover w-full h-full" />
                    </AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className="w-6 h-6 stroke-[1.5] text-red-500 group-hover:text-red-600" />, text: "Logout" },
    ]

    return (
        <div className='lefty fixed top-0 z-30 left-0 px-4 lg:px-6 border-r border-gray-100 w-[210px] h-screen bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]'>
            
            {/* Polished Mobile Close Button */}
            {closeSidebar && (
                <button 
                    onClick={closeSidebar} 
                    className="md:hidden absolute top-6 right-4 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Close
                </button>
            )}

            <div className='flex flex-col h-full'>
                {/* Logo Section */}
                <h1 className='my-8 pl-3 font-extrabold text-3xl bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent select-none cursor-pointer w-fit'>
                    Sociova
                </h1>
                
                {/* Navigation Links */}
                <div className='flex-1 flex flex-col gap-1'>
                    {
                        sidebarItems.map((item, index) => {
                            // Separating logout to push it to the bottom naturally
                            const isLogout = item.text === "Logout";
                            
                            return (
                                <div 
                                    onClick={() => sidebarHandler(item.text)} 
                                    key={index} 
                                    className={`group flex items-center gap-4 relative cursor-pointer rounded-xl p-3 transition-all duration-200 
                                        ${isLogout ? 'mt-auto mb-6 hover:bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-800 hover:text-violet-600 font-medium'}
                                    `}
                                >
                                    <div className={`transition-transform duration-200 group-hover:scale-110 ${item.text === "Profile" ? 'group-hover:scale-105' : ''}`}>
                                        {item.icon}
                                    </div>
                                    <span className='text-[15px] tracking-wide'>{item.text}</span>
                                    
                                    {/* Notification Logic */}
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        size='icon' 
                                                        className="rounded-full h-5 w-5 bg-pink-500 hover:bg-pink-600 text-white border-2 border-white absolute top-2 left-6 text-[10px] font-bold shadow-sm transition-transform hover:scale-110"
                                                    >
                                                        {likeNotification.length}
                                                    </Button>
                                                </PopoverTrigger>
                                                
                                                <PopoverContent className="w-80 p-0 rounded-2xl shadow-xl border-gray-100 overflow-hidden bg-white" align="start" sideOffset={10}>
                                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                                                        <h3 className="font-bold text-gray-900">Notifications</h3>
                                                        <button
                                                            className="text-xs px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full font-semibold hover:bg-violet-100 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevents clicking this from bubbling up
                                                                dispatch(clearNotifications());
                                                            }}
                                                        >
                                                            Clear all
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                                                        {
                                                            likeNotification.length === 0 ? (
                                                                <div className="py-8 text-center text-gray-400">
                                                                    <Heart className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                                    <p className="text-sm font-medium">No new notifications</p>
                                                                </div>
                                                            ) : (
                                                                likeNotification.map((notification) => {
                                                                    if (!user || !user.username) {
                                                                        return (
                                                                            <div key={notification.userId} className='p-3 text-sm text-gray-400 italic bg-gray-50 rounded-xl my-1'>
                                                                                A deleted user liked your post
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-3 p-2 my-1 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group/notif'>
                                                                            <Avatar className="h-10 w-10 ring-1 ring-black/5">
                                                                                <AvatarImage src={notification.userDetails?.profilePicture || defaultPlaceholder} className="object-cover" />
                                                                                <AvatarFallback>
                                                                                    <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm text-gray-700 leading-tight flex-1'>
                                                                                <span className='font-bold text-gray-900 group-hover/notif:text-violet-600 transition-colors mr-1'>
                                                                                    {notification.userDetails?.username || "Deleted User"}
                                                                                </span> 
                                                                                liked your post.
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />

        </div>
    )
}

export default LeftSidebar