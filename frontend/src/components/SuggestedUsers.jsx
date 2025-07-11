import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateFollowing } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (id) => {
    try {
      const { data } = await axios.post(
        `https://sociova.onrender.com/api/v1/user/followOrunfollow/${id}`,
        {},
        {
          withCredentials: true,
        }
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
    <div className='my-10'>
      <div className='flex items-center justify-around text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer '>See All</span>
      </div>
      {
        suggestedUsers.map((sUser) => {
          const isFollowing = user?.following?.includes(sUser._id);
          return (
            <div key={sUser._id} className='flex items-center justify-between my-5 border-2 border-gray-300 bg-white p-2 rounded-2xl'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${sUser?._id}`}>
                  <Avatar>
                    <AvatarImage src={sUser?.profilePicture} alt="post_image" />
                    <AvatarFallback>
                      <img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${sUser?._id}`}>{sUser?.username}</Link>
                  </h1>
                  <span className='text-gray-600 text-sm'>{sUser?.bio || 'Bio here...'}</span>
                </div>
              </div>
              <button
                onClick={() => handleFollowUnfollow(sUser._id)}
                className={`text-xs font-bold cursor-pointer px-3 py-1 rounded-xl transition-all duration-200 ${
                  isFollowing
                    ? 'bg-red-100 text-red-600 border border-red-400 hover:bg-red-200'
                    : 'bg-violet-100 text-violet-600 border border-violet-400 hover:bg-violet-200'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })
      }
    </div>
  );
};

export default SuggestedUsers;
