import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateFollowing, toggleFollower } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const dispatch = useDispatch();

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowUnfollow = async () => {
    try {
      const { data } = await axios.post(
        `https://sociova.onrender.com/api/v1/user/followOrunfollow/${userProfile?._id}`,
        {}, // No body required
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(updateFollowing(userProfile._id));
        dispatch(toggleFollower({ loggedInUserId: user._id }));
        toast.success(data.message);
      } else {
        alert(data.message || "Something went wrong!");
        toast.error("Error message");
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error?.response?.data || error.message);
      alert("Error: " + (error?.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className='w-full bg-white min-h-screen font-sans pb-20'>
      
      {/* 
        MAIN CENTERING WRAPPER
        This ensures the profile header stays perfectly in the middle of the screen. 
      */}
      <div className='max-w-4xl mx-auto pt-8 sm:pt-12 px-4 sm:px-8'>
        
        {/* Profile Header (Side-by-Side but Centered) */}
        <div className='flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 md:gap-20 mb-12 w-full'>
          
          {/* Avatar Section */}
          <section className='shrink-0 flex justify-center md:justify-end'>
            <Avatar className='h-32 w-32 md:h-40 md:w-40 ring-2 ring-offset-4 ring-gray-200 transition-transform hover:scale-105 duration-300 shadow-sm'>
              <AvatarImage src={userProfile?.profilePicture || defaultPlaceholder} alt="profilephoto" className="object-cover" />
              <AvatarFallback>
                  <img src={defaultPlaceholder} alt="fallback" className="object-cover w-full h-full" />
              </AvatarFallback>
            </Avatar>
          </section>

          {/* Info Section */}
          <section className='flex flex-col flex-1 items-center md:items-start gap-5 max-w-lg'>
            
            {/* Username & Buttons Row */}
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
              <h1 className='text-2xl md:text-3xl font-medium text-gray-900 tracking-tight'>
                  {userProfile?.username}
              </h1>

              <div className='flex items-center gap-2 flex-wrap justify-center sm:justify-start'>
                  {
                    isLoggedInUserProfile ? (
                      <>
                        <Link to="/account/edit">
                            <Button variant='secondary' className='h-8 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all active:scale-95 text-sm'>
                                Edit profile
                            </Button>
                        </Link>
                        <Button variant='secondary' className='h-8 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all active:scale-95 text-sm'>
                            View archive
                        </Button>
                        <Button variant='secondary' className='h-8 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all active:scale-95 text-sm'>
                            Ad tools
                        </Button>
                      </>
                    ) : (
                      isFollowing ? (
                        <>
                          <Button
                            variant='secondary'
                            className='h-8 px-5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all active:scale-95 text-sm'
                            onClick={handleFollowUnfollow}
                          >
                            Unfollow
                          </Button>
                          <Button variant='secondary' className='h-8 px-5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all active:scale-95 text-sm'>
                              Message
                          </Button>
                        </>
                      ) : (
                        <Button
                          className='h-8 px-6 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-sm transition-all active:scale-95 text-sm'
                          onClick={handleFollowUnfollow}
                        >
                          Follow
                        </Button>
                      )
                    )
                  }
              </div>
            </div>

            {/* Stats Row */}
            <div className='flex items-center gap-8 sm:gap-10 text-base text-gray-800'>
              <p><span className='font-semibold text-gray-900'>{userProfile?.posts?.length || 0} </span>posts</p>
              <p><span className='font-semibold text-gray-900'>{userProfile?.followers?.length || 0} </span>followers</p>
              <p><span className='font-semibold text-gray-900'>{userProfile?.following?.length || 0} </span>following</p>
            </div>

            {/* Bio Row */}
            <div className='flex flex-col items-center md:items-start gap-1.5 text-center md:text-left mt-1'>
              <span className='font-semibold text-gray-900 text-[15px]'>
                  {userProfile?.bio || 'Bio here...'}
              </span>
              <Badge className='bg-violet-50 text-violet-700 hover:bg-violet-100 border-0 px-2 py-0.5 rounded shadow-sm w-fit mt-1'>
                  <AtSign size={12} /> 
                  <span className='pl-1 font-semibold tracking-wide text-xs'>{userProfile?.username}</span> 
              </Badge>
            </div>
          </section>

        </div>

        {/* Divider & Tabs */}
        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center gap-12 sm:gap-16 text-xs font-bold tracking-widest text-gray-500 uppercase'>
            <span 
              className={`py-4 cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'posts' ? 'text-gray-900 border-t border-gray-900 -mt-[1px]' : 'hover:text-gray-700'}`} 
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span 
              className={`py-4 cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'saved' ? 'text-gray-900 border-t border-gray-900 -mt-[1px]' : 'hover:text-gray-700'}`} 
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className='py-4 cursor-pointer hover:text-gray-700 transition-colors hidden sm:block'>REELS</span>
            <span className='py-4 cursor-pointer hover:text-gray-700 transition-colors hidden sm:block'>TAGS</span>
          </div>

          {/* Post Grid */}
          <div className='grid grid-cols-3 gap-1 mt-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer aspect-square bg-gray-100 overflow-hidden'>
                    <img 
                      src={post.image} 
                      alt='postimage' 
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' 
                    />
                    {/* Hover Overlay */}
                    <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-6 font-bold text-lg'>
                        <div className='flex items-center gap-2'>
                          <Heart className="fill-white stroke-transparent" size={24} />
                          <span>{post?.likes?.length || 0}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MessageCircle className="fill-white stroke-transparent" size={24} />
                          <span>{post?.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          
          {/* Empty State Fallback */}
          {(!displayedPost || displayedPost.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                      <Heart size={28} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">No Posts Yet</h2>
              </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile