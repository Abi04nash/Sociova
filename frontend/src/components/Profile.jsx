import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateFollowing , toggleFollower } from '@/redux/authSlice';
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
  // const isFollowing = false;
  const isFollowing = user?.following?.includes(userProfile?._id);


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
    <div className='flex max-w-5xl justify-center mx-auto pl-10 pro'>
      <div className='flex flex-col gap-20 p-8'>
        <div className=' top grid grid-cols-2'>
          <section className=' ava flex items-center justify-center'>
            <Avatar className=' avaa border-3 border-r-violet-400  border-l-violet-400 h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
            </Avatar>
          </section>
          <section className='leftpro'>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span className='font-bold'>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit"><Button variant='secondary' className='hover:bg-slate-300 bg-gray-200  h-8'>Edit profile</Button></Link>
                      <Button variant='secondary' className='hover:bg-slate-300 bg-gray-200  h-8'>View archive</Button>
                      <Button variant='secondary' className='hover:bg-slate-300 bg-gray-200 h-8'>Ad tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button
                          variant='secondary'
                          className='bg-red-200 border-2 border-red-500 h-8'
                          onClick={handleFollowUnfollow}
                        >
                          Unfollow
                        </Button>
                        <Button variant='secondary' className=' bg-gray-200 h-8'>Message</Button>
                      </>
                    ) : (
                      <Button
                        className='bg-violet-500 hover:bg-violet-400 h-8'
                        onClick={handleFollowUnfollow}
                      >
                        Follow
                      </Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                {/* <span>☕Hey there I'm ABINASH</span>
                <span>🏫IIIT'BH 2027</span>
                <span>🖥Enthusiat Programmer</span> */}
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile