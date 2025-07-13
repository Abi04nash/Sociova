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
    <div className='chat flex flex-col md:flex-row ml-0 md:ml-[16%] h-screen bg-slate-50'>
      {/* User List */}
      <section
        className={`w-full md:w-1/4 md:block ${
          selectedUser && showChatMobile ? 'hidden' : 'block'
        }`}
      >
        <h1 className='font-bold px-3 text-2xl py-2 bg-white'>@{user?.username}</h1>
        <hr className='border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
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
                className='border-2 border-gray-300 m-2 rounded-2xl flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
              >
                <Avatar className='w-14 h-14'>
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold border-2 p-1 pl-2 pr-2 border-amber-400 rounded-2xl  ${
                      isOnline ? 'text-green-600 border-green-400 bg-green-100' : 'text-red-600 border-red-400 bg-red-100'
                    }`}
                  >
                    {isOnline ? '🪴ONLINE' : '💢OFFLINE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Panel */}
      {selectedUser ? (
        <section
          className={`leftchat flex-1 border-l border-l-gray-300 flex flex-col h-full bg-slate-100 ${
            !showChatMobile && 'hidden md:flex'
          }`}
        >
          <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
            {/* Back button for mobile */}
            <button
              onClick={() => setShowChatMobile(false)}
              className='md:hidden text-blue-600 font-bold mr-2'
            >
              ← Back
            </button>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span>{selectedUser?.username}</span>
            </div>
          </div>

          {/* Chat Messages */}
          <Messages selectedUser={selectedUser} />

          {/* Chat Input */}
          <div className='flex items-center p-4 border-t border-t-gray-600 bg-white'>
            <Input
              key={selectedUser?._id}
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type='text'
              autoFocus
              className='flex-1 mr-2 focus-visible:ring-transparent'
              placeholder='Type a message...'
            />
            <Button
              className='bg-violet-500 border-2 border-gray-400'
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        // Placeholder for no chat
        <div className='hidden md:flex flex-col items-center justify-center mx-auto w-full'>
          <MessageCircleCode className='w-32 h-32 my-4' />
          <h1 className='font-medium'>Your messages</h1>
          <span >Type something to break the silence.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
