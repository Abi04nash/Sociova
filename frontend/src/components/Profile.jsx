import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, Grid, Bookmark, Film, Tag } from 'lucide-react';
import { updateFollowing, toggleFollower, setSelectedUser } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);
  const dispatch = useDispatch();

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  let displayedPost;
  if (activeTab === 'posts') {
    displayedPost = userProfile?.posts;
  } else if (activeTab === 'saved') {
    displayedPost = userProfile?.bookmarks;
  } else if (activeTab === 'videos') {
    displayedPost = userProfile?.posts?.filter(post => post.image.match(/\.(mp4|mov|webm)$/i));
  }


  const handleFollowUnfollow = async () => {
    try {
      const { data } = await axios.post(
        `https://sociova.onrender.com/api/v1/user/followOrunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(updateFollowing(userProfile._id));
        // dispatch(toggleFollower({ loggedInUserId: user._id }));
        dispatch(toggleFollower({
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture
        }));
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='w-full ml-0 lg:ml-20 bg-slate-50 min-h-screen font-sans pb-20'>

      <div className='max-w-4xl mx-auto pt-8 sm:pt-12 px-4 sm:px-8'>

        <div className='bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100 mb-8'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-16 w-full'>

            <section className='shrink-0 flex justify-center'>
              <div className="p-1.5 bg-white rounded-full border border-gray-100 shadow-xl shadow-violet-100/50 transition-transform hover:scale-105 duration-300">
                <Avatar className='h-28 w-28 md:h-40 md:w-40'>
                  <AvatarImage src={userProfile?.profilePicture || defaultPlaceholder} alt="profilephoto" className="object-cover rounded-full" />
                  <AvatarFallback>
                    <img src={defaultPlaceholder} alt="fallback" className="object-cover w-full h-full rounded-full" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </section>

            <section className='flex flex-col flex-1 items-center md:items-start gap-6 max-w-lg pt-2 w-full'>

              <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 tracking-tight text-center md:text-left'>
                  {userProfile?.username}
                </h1>

                <div className='flex items-center gap-2 flex-wrap justify-center sm:justify-start'>
                  {isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit">
                        <Button variant='secondary' className='h-9 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-all active:scale-95 shadow-sm text-sm'>
                          Edit profile
                        </Button>
                      </Link>
                      <Button
                        variant='secondary'
                        className='h-9 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-all active:scale-95 shadow-sm text-sm hidden sm:block'
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Profile link copied!");
                        }}
                      >
                        Share profile
                      </Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button
                          variant='secondary'
                          className='h-9 px-6 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-900 font-bold transition-all active:scale-95 shadow-sm text-sm'
                          onClick={handleFollowUnfollow}
                        >
                          Unfollow
                        </Button>
                        <Button
                          variant='secondary'
                          className='h-9 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-all active:scale-95 shadow-sm text-sm'
                          onClick={() => {
                            dispatch(setSelectedUser(userProfile));
                            navigate('/chat');
                          }}
                        >
                          Message
                        </Button>
                      </>
                    ) : (
                      <Button
                        className='h-9 px-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-200 transition-all active:scale-95 text-sm'
                        onClick={handleFollowUnfollow}
                      >
                        Follow
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* FIXED RESPONSIVE STATS ROW */}
              <div className='flex items-center justify-evenly md:justify-start w-full md:w-auto gap-2 md:gap-12 text-[14px] md:text-[15px] text-gray-600 py-3 md:py-0 border-y border-gray-100 md:border-none'>
                <p className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1.5 w-24 md:w-auto">
                  <span className='font-extrabold text-gray-900 text-xl md:text-base'>{userProfile?.posts?.length || 0} </span>
                  <span className="font-medium">posts</span>
                </p>

                <Dialog open={openFollowers} onOpenChange={setOpenFollowers}>
                  <DialogTrigger className="cursor-pointer hover:text-violet-600 transition-colors group">
                    <p className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1.5 w-24 md:w-auto">
                      <span className='font-extrabold text-gray-900 text-xl md:text-base group-hover:text-violet-600 transition-colors'>{userProfile?.followers?.length || 0} </span>
                      <span className="font-medium">followers</span>
                    </p>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs sm:max-w-sm rounded-[24px] bg-white p-5 border-0 shadow-2xl">
                    <h2 className="font-bold text-center border-b border-gray-50 pb-4 mb-2 text-gray-900 text-lg">Followers</h2>
                    <div className="max-h-[350px] overflow-y-auto flex flex-col gap-1 p-1 custom-scrollbar">
                      {userProfile?.followers?.map((follower) => (
                        <div
                          key={follower._id}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-violet-50/50 hover:shadow-sm border border-transparent hover:border-violet-100 cursor-pointer transition-all group"
                          onClick={() => {
                            setOpenFollowers(false);
                            navigate(`/profile/${follower._id}`);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-violet-200 transition-all">
                              <AvatarImage src={follower.profilePicture || defaultPlaceholder} className="object-cover" />
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-gray-900">{follower.username}</span>
                              <span className="text-xs text-gray-500 font-medium mt-0.5">View profile</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={openFollowing} onOpenChange={setOpenFollowing}>
                  <DialogTrigger className="cursor-pointer hover:text-violet-600 transition-colors group">
                    <p className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1.5 w-24 md:w-auto">
                      <span className='font-extrabold text-gray-900 text-xl md:text-base group-hover:text-violet-600 transition-colors'>{userProfile?.following?.length || 0} </span>
                      <span className="font-medium">following</span>
                    </p>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs sm:max-w-sm rounded-[24px] bg-white p-5 border-0 shadow-2xl">
                    <h2 className="font-bold text-center border-b border-gray-50 pb-4 mb-2 text-gray-900 text-lg">Following</h2>
                    <div className="max-h-[350px] overflow-y-auto flex flex-col gap-1 p-1 custom-scrollbar">
                      {userProfile?.following?.map((followingUser) => (
                        <div
                          key={followingUser._id}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-violet-50/50 hover:shadow-sm border border-transparent hover:border-violet-100 cursor-pointer transition-all group"
                          onClick={() => {
                            setOpenFollowing(false);
                            navigate(`/profile/${followingUser._id}`);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-violet-200 transition-all">
                              <AvatarImage src={followingUser.profilePicture || defaultPlaceholder} className="object-cover" />
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-gray-900">{followingUser.username}</span>
                              <span className="text-xs text-gray-500 font-medium mt-0.5">View profile</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className='flex flex-col items-center md:items-start gap-2 text-center md:text-left mt-1 w-full px-4 md:px-0'>
                <span className='font-medium text-gray-800 text-[15px] leading-relaxed'>
                  {userProfile?.bio || 'No bio yet.'}
                </span>
                <Badge className='bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100 px-3 py-1 rounded-full shadow-sm w-fit mt-1'>
                  <AtSign size={13} className="mr-1" />
                  <span className='font-bold tracking-wide text-xs'>{userProfile?.username}</span>
                </Badge>
              </div>
            </section>
          </div>
        </div>

        <div className='border-t border-gray-200 mt-2'>
          <div className='flex items-center justify-center gap-10 sm:gap-16 text-[13px] font-bold tracking-[0.1em] text-gray-400 uppercase'>
            <span
              className={`py-4 cursor-pointer transition-all duration-300 flex items-center gap-2 relative ${activeTab === 'posts' ? 'text-gray-900' : 'hover:text-gray-600'}`}
              onClick={() => handleTabChange('posts')}
            >
              <Grid size={16} className={activeTab === 'posts' ? 'text-violet-600' : ''} />
              POSTS
              {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-600 rounded-t-full"></div>}
            </span>

            <span
              className={`py-4 cursor-pointer transition-all duration-300 flex items-center gap-2 relative ${activeTab === 'videos' ? 'text-gray-900' : 'hover:text-gray-600'}`}
              onClick={() => handleTabChange('videos')}
            >
              <Film size={16} className={activeTab === 'videos' ? 'text-violet-600' : ''} />
              VIDEOS
              {activeTab === 'videos' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-600 rounded-t-full"></div>}
            </span>

            <span
              className={`py-4 cursor-pointer transition-all duration-300 flex items-center gap-2 relative ${activeTab === 'saved' ? 'text-gray-900' : 'hover:text-gray-600'}`}
              onClick={() => handleTabChange('saved')}
            >
              <Bookmark size={16} className={activeTab === 'saved' ? 'text-violet-600' : ''} />
              SAVED
              {activeTab === 'saved' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-violet-600 rounded-t-full"></div>}
            </span>
          </div>

          <div className='grid grid-cols-3 gap-1.5 md:gap-3 mt-4'>
            {displayedPost?.map((post) => {
              const isVideo = post.image.match(/\.(mp4|mov|webm)$/i);

              return (
                <div key={post?._id} className='relative group cursor-pointer aspect-square bg-gray-100 overflow-hidden rounded-xl md:rounded-2xl flex items-center justify-center bg-black'>
                  {isVideo ? (
                    <video
                      src={post.image}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={post.image}
                      alt='postimage'
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10'>
                    <div className='flex items-center text-white space-x-6 font-bold text-lg md:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                      <div className='flex items-center gap-2 drop-shadow-md'>
                        <Heart className="fill-white stroke-transparent" size={24} />
                        <span>{post?.likes?.length || 0}</span>
                      </div>
                      <div className='flex items-center gap-2 drop-shadow-md'>
                        <MessageCircle className="fill-white stroke-transparent" size={24} />
                        <span>{post?.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Small Video Icon Indicator (Optional, but good UX) */}
                  {isVideo && (
                    <div className="absolute top-2 right-2 z-10">
                      <Film className="text-white drop-shadow-md" size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {(!displayedPost || displayedPost.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-3xl mt-4 border border-gray-100">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 bg-gray-50">
                <Heart size={32} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
              <p className="text-sm text-gray-500 font-medium text-center px-4">Posts will appear on your profile.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile;