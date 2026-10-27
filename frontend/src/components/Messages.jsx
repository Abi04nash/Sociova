import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'
import { Lock } from 'lucide-react' // Added icon for the restriction banner

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    
    // --- NEW LOGIC: Check follow relationship ---
    const isFollowing = user?.following?.includes(selectedUser?._id);
    const isFollower = user?.followers?.includes(selectedUser?._id);
    const canMessage = isFollowing || isFollower;
    
    return (    
        <div className='flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 custom-scrollbar'>
            {/* Header Profile Section */}
            <div className='flex justify-center mb-8'>
                <div className='flex flex-col items-center justify-center space-y-3 pb-6 border-b border-gray-200/70 w-full max-w-md'>
                    <Avatar className="h-24 w-24 shadow-md ring-4 ring-white transition-transform hover:scale-105 duration-300">
                        <AvatarImage 
                            src={selectedUser?.profilePicture} 
                            alt='profile' 
                            className="object-cover"
                        />
                        <AvatarFallback>
                            <img 
                                src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" 
                                alt="fallback" 
                                className="object-cover"
                            />
                        </AvatarFallback>
                    </Avatar>
                    
                    <span className='text-xl font-bold text-gray-800 tracking-tight'>
                        {selectedUser?.username}
                    </span>
                    
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button 
                            className="h-9 px-5 mt-1 bg-white border border-gray-300 text-violet-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 rounded-full shadow-sm transition-all duration-200 font-medium" 
                            variant="secondary"
                        >
                            View profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Chat Messages Section */}
            <div className='flex flex-col gap-4 max-w-4xl mx-auto pb-4'>
                {
                   messages && messages.map((msg) => {
                        return (
                            <div 
                                key={msg._id} 
                                className={`flex w-full ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`
                                        px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[75%] md:max-w-[65%] 
                                        break-words text-sm sm:text-base shadow-sm leading-relaxed
                                        ${msg.senderId === user?._id 
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm shadow-blue-500/20' 
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-black/5'
                                        }
                                    `}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }

                {/* --- NEW: Restricted Messaging Banner --- */}
                {!canMessage && (
                    <div className="mt-6 p-5 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm max-w-md mx-auto">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Messaging Unavailable</h3>
                        <span className="text-sm font-medium text-gray-500">
                            You can only message users you follow or who follow you.
                        </span>
                    </div>
                )}
            </div>
        </div>  
    )
}

export default Messages