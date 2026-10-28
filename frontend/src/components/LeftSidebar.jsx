import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, X } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { clearNotifications } from '@/redux/rtnSlice'
import SearchDialog from './SearchDialog'
import { Dialog, DialogContent } from './ui/dialog' 

const LeftSidebar = ({ closeSidebar }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

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
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Search") {   
            setSearchOpen(true);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'Notifications') {
            setShowNotifications(true);
        }
    }

    const sidebarItems = [
        { icon: <Home className="w-6 h-6 stroke-[1.5]" />, text: "Home" },
        { icon: <Search className="w-6 h-6 stroke-[1.5]" />, text: "Search" },
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
            
            {closeSidebar && (
                <button 
                    onClick={closeSidebar} 
                    className="md:hidden absolute top-6 right-4 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Close
                </button>
            )}

            <div className='flex flex-col h-full'>
                <h1 className='my-8 pl-3 font-extrabold text-3xl bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent select-none cursor-pointer w-fit'>
                    Sociova
                </h1>
                
                <div className='flex-1 flex flex-col gap-1'>
                    {
                        sidebarItems.map((item, index) => {
                            const isLogout = item.text === "Logout";
                            
                            return (
                                <div 
                                    onClick={() => sidebarHandler(item.text)} 
                                    key={index} 
                                    className={`group flex items-center gap-4 cursor-pointer rounded-xl p-3 transition-all duration-200 
                                        ${isLogout ? 'mt-auto mb-6 hover:bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-800 hover:text-violet-600 font-medium'}
                                    `}
                                >
                                    {/* ✅ FIX: Made icon container relative so the badge can perfectly overlap the top-right corner */}
                                    <div className={`relative transition-transform duration-200 group-hover:scale-110 ${item.text === "Profile" ? 'group-hover:scale-105' : ''}`}>
                                        {item.icon}
                                        
                                        {item.text === "Notifications" && likeNotification.length > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-violet-600 text-white text-[10px] font-extrabold rounded-full shadow-sm border-2 border-white">
                                                {likeNotification.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <span className='text-[15px] tracking-wide'>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
            <SearchDialog open={searchOpen} setOpen={setSearchOpen} />

            {/* Desktop Notifications Modal */}
            <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogContent className="max-h-[85vh] w-[90vw] sm:max-w-md p-0 overflow-hidden rounded-3xl bg-white shadow-2xl border-0 flex flex-col z-[100]">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                        <h2 className='text-xl font-extrabold text-gray-900'>Notifications</h2>
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
                        {likeNotification?.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                <Heart className="w-14 h-14 mb-4 opacity-20" />
                                <p className="text-base font-medium">No new notifications</p>
                                <p className="text-sm mt-1 text-gray-400 text-center px-4">When someone likes your post or messages you, it will show up here.</p>
                            </div>
                        ) : (
                            likeNotification?.map((notification, i) => (
                                <div 
                                    key={i} 
                                    className='flex items-center gap-3 p-3 my-1 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer'
                                    onClick={() => {
                                        if (notification.type === 'message') {
                                            setShowNotifications(false);
                                            navigate('/chat');
                                        }
                                    }}
                                >
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
    )
}

export default LeftSidebar;