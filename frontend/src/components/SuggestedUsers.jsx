import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateFollowing } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';

// ✅ STEP 1: yahan { onClose } prop add kiya
const SuggestedUsers = ({ onClose }) => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const handleFollowUnfollow = async (id) => {
    try {
      const { data } = await axios.post(
        `https://sociova.onrender.com/api/v1/user/followOrunfollow/${id}`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(updateFollowing(id));
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='my-6 flex flex-col gap-4'>
      <div className='flex items-center justify-between text-sm px-2'>
        <h1 className='font-bold text-gray-500 tracking-wide'>Suggested for you</h1>
        <span className='font-bold text-violet-600 hover:text-violet-800 cursor-pointer transition-colors'>See All</span>
      </div>

      <div className='flex flex-col gap-1'>
        {suggestedUsers.map((sUser) => {
          const isFollowing = user?.following?.includes(sUser._id);
          return (
            <div key={sUser._id} className='flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group'>
              <div className='flex items-center gap-3 min-w-0'>
                
                {/* ✅ STEP 2: onClick={onClose} dono Links par laga diya */}
                <Link to={`/profile/${sUser?._id}`} onClick={onClose} className="shrink-0">
                  <Avatar className="h-11 w-11 ring-1 ring-black/5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={sUser?.profilePicture || defaultPlaceholder} className="object-cover" />
                    <AvatarFallback>
                      <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                
                <div className='flex flex-col min-w-0'>
                  <h1 className='font-bold text-sm text-gray-900 truncate leading-tight'>
                    <Link to={`/profile/${sUser?._id}`} onClick={onClose} className="hover:text-gray-500 transition-colors">
                      {sUser?.username}
                    </Link>
                  </h1>
                  <span className='text-gray-500 text-xs font-medium truncate mt-0.5 max-w-[160px]'>
                    {sUser?.bio || 'Bio here...'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleFollowUnfollow(sUser._id)}
                className={`text-xs font-bold cursor-pointer px-4 py-1.5 rounded-full transition-all duration-200 active:scale-95 shrink-0 ml-2 ${
                  isFollowing
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-500/20'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;






