import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [showChatMobile, setShowChatMobile] = useState(false);

  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://sociova.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Reset selected user on unmount
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  // Auto-focus fix on mobile input
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = document.querySelector('input[placeholder="Type a message..."]');
      input?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedUser]);

  return (
    <div className='chat flex flex-col md:flex-row ml-0 md:ml-[16%] h-screen bg-gray-50 font-sans'>
      
      {/* User List Section */}
      <section
        // The fix is here: 'hidden md:flex' ensures it only hides on tiny mobile screens, but stays visible on desktop!
        className={`w-full md:w-1/3 lg:w-[350px] bg-white border-r border-gray-200/60 shadow-sm flex-shrink-0 flex-col h-full ${
          selectedUser && showChatMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm sticky top-0 z-10 px-5 py-4 border-b border-gray-100">
            <h1 className='font-bold text-xl text-gray-800 tracking-tight'>@{user?.username}</h1>
        </div>
        
        <div className='overflow-y-auto flex-1 p-2 custom-scrollbar'>
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => {
                  dispatch(setSelectedUser(suggestedUser));
                  setTextMessage('');
                  setShowChatMobile(true);
                }}
                className='group m-1 p-3 rounded-2xl flex gap-4 items-center cursor-pointer transition-all duration-200 hover:bg-violet-50 hover:shadow-sm border border-transparent hover:border-violet-100'
              >
                <Avatar className='w-14 h-14 ring-2 ring-transparent group-hover:ring-violet-200 transition-all duration-300 shadow-sm'>
                  <AvatarImage src={suggestedUser?.profilePicture || defaultPlaceholder} className="object-cover" />
                  <AvatarFallback>
                      <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                  </AvatarFallback>
                </Avatar>
                
                <div className='flex flex-col flex-1'>
                  <span className='font-semibold text-gray-800 text-base'>{suggestedUser?.username}</span>
                  <span
                    className={`text-[11px] font-bold mt-0.5 px-2 py-0.5 w-max rounded-full tracking-wide transition-colors ${
                      isOnline 
                        ? 'bg-green-100 text-green-700 border border-green-200/50' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200/50'
                    }`}
                  >
                    {isOnline ? '🪴 ONLINE' : '💢 OFFLINE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Panel Section */}
      {selectedUser ? (
        <section
          // Added 'hidden md:flex' logic here to ensure side-by-side view works perfectly
          className={`flex-1 flex-col h-full bg-slate-50 relative ${
            !showChatMobile ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className='flex gap-4 items-center px-5 py-3.5 border-b border-gray-200/60 sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-sm'>
            {/* Back button for mobile */}
            <button
              onClick={() => setShowChatMobile(false)}
              className='md:hidden flex items-center justify-center p-2 mr-1 -ml-2 text-violet-600 hover:bg-violet-50 rounded-full transition-colors'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <Avatar className="h-10 w-10 shadow-sm ring-2 ring-white">
              <AvatarImage src={selectedUser?.profilePicture || defaultPlaceholder} alt='profile' className="object-cover" />
              <AvatarFallback>
                 <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-bold text-gray-800 tracking-tight text-lg leading-tight'>{selectedUser?.username}</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
             <Messages selectedUser={selectedUser} />
          </div>

          {/* Chat Input */}
          <div className='flex items-center gap-3 p-4 bg-white border-t border-gray-200/60 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10'>
            <Input
              key={selectedUser?._id}
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type='text'
              autoFocus
              className='flex-1 rounded-full bg-gray-100/80 border-transparent focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:bg-white transition-all duration-200 px-5 py-6 text-base'
              placeholder='Type a message...'
            />
            <Button
              className='rounded-full h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md shadow-violet-500/20 transition-all duration-200 active:scale-95'
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        // Empty State Placeholder
        <div className='hidden md:flex flex-col items-center justify-center mx-auto w-full h-full bg-slate-50/50'>
          <div className="bg-white p-8 rounded-full shadow-sm mb-6 ring-1 ring-gray-100">
             <MessageCircleCode className='w-16 h-16 text-violet-400' />
          </div>
          <h1 className='text-2xl font-bold text-gray-800 tracking-tight mb-2'>Your Messages</h1>
          <span className="text-gray-500 font-medium">Select a user to break the silence.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;