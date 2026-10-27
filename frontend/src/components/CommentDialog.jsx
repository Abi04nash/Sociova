import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    useEffect(() => {
      if (selectedPost) {
        setComment(selectedPost.comments);
      }
    }, [selectedPost]);

    const changeEventHandler = (e) => {
      const inputText = e.target.value;
      if (inputText.trim()) {
        setText(inputText);
      } else {
        setText("");
      }
    }

    const sendMessageHandler = async () => {
      try {
        const res = await axios.post(`https://sociova.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        if (res.data.success) {
          const updatedCommentData = [...comment, res.data.comment];
          setComment(updatedCommentData);

          const updatedPostData = posts.map(p =>
            p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
          );
          dispatch(setPosts(updatedPostData));
          toast.success(res.data.message);
          setText("");
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 1. STRICT HEIGHT ON THE DIALOG CONTENT */}
      <DialogContent 
        onInteractOutside={() => setOpen(false)} 
        className="w-[95vw] md:w-full max-w-5xl p-0 flex flex-col rounded-2xl overflow-hidden border-0 shadow-2xl bg-white h-[85vh] md:h-[650px] max-h-[85vh]"
      >
        <div className='flex flex-col md:flex-row w-full h-full'>
          
          {/* 2. LEFT SIDE: Strictly 40% height on mobile, 100% on desktop (Now Supports Video) */}
          <div className='w-full md:w-1/2 bg-black/5 flex items-center justify-center relative overflow-hidden shrink-0 h-[40%] md:h-full bg-black'>
            {selectedPost?.image && (
                selectedPost.image.match(/\.(mp4|mov|webm)$/i) ? (
                    <video 
                        src={selectedPost.image} 
                        controls
                        autoPlay
                        muted
                        loop
                        className='w-full h-full object-contain'
                    />
                ) : (
                    <img
                        src={selectedPost.image}
                        alt="post_media"
                        className='w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]'
                    />
                )
            )}
          </div>

          {/* 3. RIGHT SIDE: Strictly 60% height on mobile, 100% on desktop */}
          <div className='w-full md:w-1/2 flex flex-col bg-white h-[60%] md:h-full'>
            
            {/* Header Section */}
            <div className='flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0'>
              <div className='flex gap-3 items-center'>
                <Link to={`/profile/${selectedPost?.author?._id}`} onClick={() => setOpen(false)}>
                  <Avatar className="h-9 w-9 ring-1 ring-black/5 shadow-sm hover:opacity-80 transition-opacity">
                      <AvatarImage src={selectedPost?.author?.profilePicture || defaultPlaceholder} className="object-cover" />
                    <AvatarFallback>
                        <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                   <Link 
                        to={`/profile/${selectedPost?.author?._id}`} 
                        onClick={() => setOpen(false)}
                        className='font-bold text-sm text-gray-900 hover:text-gray-600 transition-colors'
                    >
                       {selectedPost?.author?.username}
                   </Link>
                </div>
              </div>
            </div>

            {/* Scrollable Comments List - Automatically takes remaining space in the 60% block */}
            <div className='flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30'>
              {comment.length > 0 ? (
                  comment.map((commentItem) => <Comment key={commentItem._id} comment={commentItem} />)
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <span className="text-sm font-medium">No comments yet.</span>
                      <span className="text-xs">Start the conversation.</span>
                  </div>
              )}
            </div>
            
            {/* Input Area - Permanently pinned to the bottom of the 60% block */}
            <div className='p-3 sm:p-4 border-t border-gray-100 bg-white shrink-0'>
              <div className='flex items-center gap-3 relative'>
                <input 
                    type="text" 
                    value={text} 
                    onChange={changeEventHandler} 
                    placeholder='Add a comment...' 
                    className='w-full outline-none border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200/50 text-sm py-3 pl-4 pr-20 rounded-full transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white' 
                />
                <Button 
                    disabled={!text.trim()} 
                    onClick={sendMessageHandler} 
                    className='absolute right-1.5 h-9 px-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-200'
                >
                    Post
                </Button>
              </div>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
