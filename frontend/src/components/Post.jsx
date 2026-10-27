import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { updateBookmarks, updateFollowing, toggleFollower } from '@/redux/authSlice';
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Post = ({ post }) => {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    
    const isLiked = post.likes.some(like => (like._id === user?._id || like === user?._id));
    const likesCount = post.likes.length;
    const isBookmarked = user?.bookmarks?.includes(post._id); 
    
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    if (!post.author) {
        return (
            <div className="bg-gray-50 border border-gray-100 text-gray-500 p-6 rounded-3xl text-center text-sm font-medium w-full max-w-md mx-auto my-4 shadow-sm">
                This post's author has been deleted.
            </div>
        );
    }

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const handleFollowUnfollow = async () => {
        try {
            const { data } = await axios.post(
                `https://sociova.onrender.com/api/v1/user/followOrunfollow/${post.author._id}`,
                {},
                { withCredentials: true }
            );

            if (data.success) {
                dispatch(updateFollowing(post.author._id));
                dispatch(toggleFollower(post.author._id));
                toast.success(data.message);
            }
        } catch (err) {
            console.error("Follow/Unfollow Error:", err);
            toast.error("Something went wrong!");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = isLiked ? 'dislike' : 'like';
            
            const updatedPostData = posts.map(p =>
                p._id === post._id ? {
                    ...p,
                    likes: isLiked 
                        ? p.likes.filter(like => (typeof like === 'object' ? like._id : like) !== user._id) 
                        : [...p.likes, { _id: user._id, username: user.username, profilePicture: user.profilePicture }]
                } : p
            );
            
            // The UI will update the exact millisecond you click the button
            dispatch(setPosts(updatedPostData)); 

            // Now send the request to the backend in the background
            const res = await axios.get(`https://sociova.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            
            if (!res.data.success) {
                toast.error("Failed to like post");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://sociova.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://sociova.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messsage);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://sociova.onrender.com/api/v1/post/${post._id}/bookmark`, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(updateBookmarks(res.data.bookmarks));
                toast.success(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='bg-white border border-gray-100 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-4 my-6 w-full max-w-md mx-auto'>
            <div className='flex items-center justify-between mb-3 px-1'>
                <div className='flex items-center gap-3 cursor-pointer'
                onClick={() => navigate(`/profile/${post.author?._id}`)}>
                    <Avatar className="h-10 w-10 ring-1 ring-black/5 shadow-sm">
                        <AvatarImage src={post.author?.profilePicture || defaultPlaceholder} alt="post_image" className="object-cover" />
                        <AvatarFallback>
                            <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col'>
                        <div className="flex items-center gap-2">
                            <h1 className='font-bold text-sm text-gray-900'>{post.author?.username}</h1>
                            {user?._id === post.author._id && (
                                <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 text-[10px] px-1.5 py-0 border-0">
                                    Author
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Options Menu */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors active:scale-95">
                            <MoreHorizontal size={20} />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs py-10 px-4 rounded-3xl bg-white border border-gray-100 shadow-2xl flex flex-col gap-2">
                        {
                            post?.author?._id !== user?._id && (
                                <Button
                                    onClick={handleFollowUnfollow}
                                    variant='ghost'
                                    className={`w-full py-6 font-bold rounded-2xl transition-all duration-200 ${user?.following?.includes(post.author._id)
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                                        }`}
                                >
                                    {user?.following?.includes(post.author._id) ? 'Unfollow' : 'Follow'}
                                </Button>
                            )
                        }

                        <Button
                            variant='ghost'
                            onClick={bookmarkHandler}
                            className={`w-full py-6 font-bold rounded-2xl transition-all duration-200 ${isBookmarked
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                                }`}
                        >
                            {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        </Button>

                        {
                            user && user?._id === post?.author._id && (
                                <Button
                                    onClick={deletePostHandler}
                                    variant='ghost'
                                    className="w-full py-6 font-bold rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                                >
                                    Delete Post
                                </Button>
                            )
                        }
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Media - Renders Video or Image */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-900 shadow-sm relative group flex justify-center items-center aspect-square sm:aspect-[4/5]">
                {post.image.match(/\.(mp4|mov|webm)$/i) ? (
                    <video 
                        src={post.image} 
                        controls
                        autoPlay
                        muted
                        loop
                        className='relative z-10 w-full h-full object-contain'
                    />
                ) : (
                    <>
                        <img 
                            src={post.image} 
                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110" 
                            alt="bg-blur" 
                        />
                        <img
                            className='relative z-10 w-full h-full object-contain'
                            src={post.image}
                            alt="post_img"
                        />
                    </>
                )}
            </div>

            {/* Actions Bar */}
            <div className='flex items-center justify-between my-4 px-1'>
                <div className='flex items-center gap-4'>
                    {
                        isLiked ? (
                            <FaHeart onClick={likeOrDislikeHandler} size={26} className='cursor-pointer text-violet-500 hover:text-violet-600 transition-transform active:scale-75' />
                        ) : (
                            <FaRegHeart onClick={likeOrDislikeHandler} size={26} className='cursor-pointer text-gray-700 hover:text-gray-400 transition-transform active:scale-75' />
                        )
                    }

                    <MessageCircle
                        size={26}
                        strokeWidth={1.5}
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                        className='cursor-pointer text-gray-700 hover:text-gray-400 transition-transform active:scale-95'
                    />

                    <Send size={26} strokeWidth={1.5} className='cursor-pointer text-gray-700 hover:text-gray-400 transition-transform active:scale-95' />
                </div>

                {isBookmarked ? (
                    <Bookmark onClick={bookmarkHandler} size={26} strokeWidth={1.5} className='cursor-pointer text-violet-600 fill-violet-600 transition-transform active:scale-75' />
                ) : (
                    <Bookmark onClick={bookmarkHandler} size={26} strokeWidth={1.5} className='cursor-pointer text-gray-700 hover:text-gray-400 transition-transform active:scale-75' />
                )}
            </div>

            {/* Likes count */}
            <div className="px-1 mb-2">
                <Dialog>
                    <DialogTrigger className="cursor-pointer hover:text-violet-600 transition-colors group">
                        <span className='font-bold text-sm text-gray-900 group-hover:text-violet-600 transition-colors'>{likesCount} likes</span>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs sm:max-w-sm rounded-[24px] bg-white p-5 border-0 shadow-2xl">
                        <h2 className="font-bold text-center border-b border-gray-50 pb-4 mb-2 text-gray-900 text-lg">Likes</h2>
                        <div className="max-h-[350px] overflow-y-auto flex flex-col gap-1 p-1 custom-scrollbar">
                            {post?.likes?.map((likeItem, index) => {
                                const isObject = typeof likeItem === 'object';
                                const likeId = isObject ? likeItem._id : likeItem;
                                const likeUsername = isObject ? likeItem.username : 'User';
                                const likeProfilePic = (isObject && likeItem.profilePicture) ? likeItem.profilePicture : defaultPlaceholder;

                                return (
                                    <div 
                                        key={likeId || index} 
                                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-violet-50/50 hover:shadow-sm border border-transparent hover:border-violet-100 cursor-pointer transition-all group"
                                        onClick={() => navigate(`/profile/${likeId}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-violet-200 transition-all">
                                                <AvatarImage src={likeProfilePic} className="object-cover" />
                                                <AvatarFallback>
                                                    <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <span className="font-bold text-sm text-gray-900">{likeUsername}</span>
                                                <span className="text-xs text-gray-500 font-medium mt-0.5">View profile</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="px-1 mb-2 text-sm leading-relaxed">
                <span className='font-bold text-gray-900 mr-2'>{post.author?.username}</span>
                <span className="text-gray-800">{post.caption}</span>
            </div>

            {/* View Comments */}
            {
                comment.length > 0 && (
                    <span
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                        className='cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-1 block mb-3'
                    >
                        View all {comment.length} comments
                    </span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} />

            <div className='flex items-center gap-2 mt-3 pt-3 border-t border-gray-100'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='flex-1 outline-none text-sm bg-gray-50/80 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 focus:ring-2 focus:ring-violet-100 rounded-full px-4 py-2.5 transition-all duration-200'
                />
                {
                    text && (
                        <Button
                            onClick={commentHandler}
                            className='h-10 px-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all active:scale-95 shadow-sm'
                        >
                            Post
                        </Button>
                    )
                }
            </div>
        </div>
    )
}

export default Post