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
        {/* Overlay to detect outside clicks manually */}
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
        <DialogContent
          className="max-w-md z-50 bg-violet-100"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className='text-center font-semibold'>
            Share New Post
          </DialogHeader>

          <div className='flex gap-3 items-center p-2 bg-white rounded-2xl'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>

          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none bg-white"
            placeholder="Write a caption..."
          />

          {imagePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
            </div>
          )}

          <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />

          <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-violet-500 hover:bg-violet-300'>
            Select from the device
          </Button>

          {imagePreview && (
            loading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreatePost;
