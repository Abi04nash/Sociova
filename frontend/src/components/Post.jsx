import React, { useState, useEffect } from 'react'
// import Posts from './Posts'
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
import { updateBookmarks } from '@/redux/authSlice';
import { Badge } from './ui/badge'
import { updateFollowing, toggleFollower } from '@/redux/authSlice';



const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    //    const [bookmarked, setBookmarked] = useState(post?.bookmarks?.includes(user?._id) || false);
    // const [bookmarked, setBookmarked] = useState(false);
    const isBookmarked = user?.bookmarks?.includes(post._id); // ✅ stable color
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();






    if (!post.author) {
        return (
            <div className="bg-red-100 text-red-500 p-4 rounded-xl text-center">
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
                `http://localhost:8000/api/v1/user/followOrunfollow/${post.author._id}`,
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
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // apne post ko update krunga
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
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
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true })
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
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, {
                withCredentials: true,
            });

            if (res.data.success) {
                // const updatedBookmarks = res.data.bookmarks;

                // ✅ You must update user bookmarks in Redux here
                dispatch(updateBookmarks(res.data.bookmarks));
                toast.success(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };








    return (
        <div className=' bg-slate-100 border-2 p-2 rounded-2xl my-0 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
                    </Avatar>
                    {/* <h1>{post.author?.username}</h1> */}



                    <div className='flex items-center gap-3'>
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary" className="bg-blue-300">Author</Badge>}
                    </div>
                </div>



                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                            post?.author?._id !== user?._id && (
                                <Button
                                    onClick={handleFollowUnfollow}
                                    variant='ghost'
                                    className={`cursor-pointer border-2 w-fit font-bold transition-all duration-200 ${user?.following?.includes(post.author._id)
                                            ? 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200'
                                            : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                                        }`}
                                >
                                    {user?.following?.includes(post.author._id) ? 'Unfollow' : 'Follow'}
                                </Button>
                            )
                        }



                        {/* <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button> */}
                        <Button
                            variant='ghost'
                            onClick={bookmarkHandler}
                            className={`cursor-pointer bg-pink-100 border-2 border-pink-400 w-fit ${isBookmarked ? ' bg-red-100 border-2 border-red-400 text-red-500' : '  bg-pink-100 border-2 border-pink-400 text-[#ea32b3]'}`}
                        >
                            {isBookmarked ? 'Remove from bookmark🗑' : 'Add to bookmark📑'}
                        </Button>

                        {/* <Button variant='ghost' className="cursor-pointer w-fit">Delete</Button> */}
                        {
                            user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className=" bg-slate-100 border-gray-400 border-2 cursor-pointer text-[#f12d2d] w-fit">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>

            <img
                className='aa rounded-2xl my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>

                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-violet-500' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }


                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                {isBookmarked ? (
                    <Bookmark onClick={bookmarkHandler} className='cursor-pointer text-violet-500' />
                ) : (
                    <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
                )}



            </div>

            <span className='font-medium block mb-2'>{postLike} likes</span>

            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>

            {
                comment.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
                )
            }

            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {
                    text && <Button onClick={commentHandler} className='text-white bg-violet-400 font-medium cursor-pointer'>Post</Button>
                }

            </div>




        </div>
    )
}

export default Post
