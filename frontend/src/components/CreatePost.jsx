import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogPortal } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post('https://sociova.onrender.com/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption('');
        setImagePreview('');
        setFile('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        {/* Modern dark overlay with backdrop blur */}
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
        <DialogContent
          className="max-w-lg w-[95%] sm:w-full p-0 z-50 bg-white rounded-3xl border-0 shadow-2xl overflow-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <DialogHeader className='py-4 px-6 border-b border-gray-100 text-center'>
            <h2 className='font-bold text-gray-900 text-lg tracking-tight'>Share New Post</h2>
          </DialogHeader>

          {/* Body Content */}
          <div className='p-5 sm:p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto custom-scrollbar'>
            
            {/* User Info */}
            <div className='flex gap-3 items-center'>
              <Avatar className="h-11 w-11 ring-2 ring-violet-50 shadow-sm">
                <AvatarImage src={user?.profilePicture || defaultPlaceholder} alt="profile_img" className="object-cover" />
                <AvatarFallback>
                  <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <h1 className='font-bold text-sm text-gray-900'>{user?.username}</h1>
                <span className='text-gray-500 text-xs font-medium'>{user?.bio || 'Bio here...'}</span>
              </div>
            </div>

            {/* Caption Textarea */}
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none min-h-[100px] p-4 text-base bg-gray-50/80 border border-gray-200/60 rounded-2xl focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:bg-white focus-visible:border-violet-300 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
              placeholder="What's on your mind? Write a caption..."
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className='w-full aspect-square sm:aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative group'>
                <img 
                    src={imagePreview} 
                    alt="preview_img" 
                    className='object-cover h-full w-full transition-transform duration-500 group-hover:scale-105' 
                />
              </div>
            )}

            <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} accept="image/*" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
                <Button 
                    onClick={() => imageRef.current.click()} 
                    variant={imagePreview ? "outline" : "default"}
                    className={`w-full rounded-xl h-11 font-semibold transition-all duration-200 ${
                        imagePreview 
                        ? 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900' 
                        : 'bg-violet-50 text-violet-600 hover:bg-violet-100 shadow-sm'
                    }`}
                >
                  {imagePreview ? 'Change Selected Image' : 'Select from the device'}
                </Button>

                {imagePreview && (
                  loading ? (
                    <Button disabled className="w-full rounded-xl h-11 bg-violet-400 text-white font-semibold">
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      Please wait...
                    </Button>
                  ) : (
                    <Button 
                        onClick={createPostHandler} 
                        type="submit" 
                        className="w-full rounded-xl h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all"
                    >
                        Share Post
                    </Button>
                  )
                )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreatePost;