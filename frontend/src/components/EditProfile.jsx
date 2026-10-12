import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }


    const editProfileHandler = async () => {
        console.log(input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto){
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('https://sociova.onrender.com/api/v1/user/profile/edit', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            });
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messasge);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 w-full edit font-sans'>
            <section className='bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 lg:p-10 my-8 flex flex-col w-full'>
                
                <h1 className='font-extrabold text-2xl text-gray-900 tracking-tight mb-8'>Edit Profile</h1>
                
                {/* Profile Photo Header Card */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50/80 border border-gray-100 rounded-2xl p-5 mb-8 gap-4 sm:gap-0'>
                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                        <Avatar className="h-16 w-16 shadow-sm ring-4 ring-white">
                            <AvatarImage src={user?.profilePicture || defaultPlaceholder} alt="profile_image" className="object-cover" />
                            <AvatarFallback>
                                <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col min-w-0'>
                            <h1 className='font-bold text-base text-gray-900 truncate'>{user?.username}</h1>
                            <span className='text-gray-500 text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' accept="image/*" />
                    <Button 
                        onClick={() => imageRef?.current.click()} 
                        className='bg-white text-violet-600 border border-gray-200 hover:bg-violet-50 hover:border-violet-200 shadow-sm rounded-full px-5 h-9 font-semibold transition-all w-full sm:w-auto'
                    >
                        Change photo
                    </Button>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-6">
                    <div>
                        <h1 className='font-semibold text-sm text-gray-700 mb-2'>Bio</h1>
                        <Textarea 
                            value={input.bio} 
                            onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                            name='bio' 
                            placeholder="Write a little bit about yourself..."
                            className="resize-none min-h-[120px] p-4 text-base bg-gray-50/80 border border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:bg-white focus-visible:border-violet-300 transition-all duration-200 text-gray-800 placeholder:text-gray-400" 
                        />
                    </div>
                    
                    <div>
                        <h1 className='font-semibold text-sm text-gray-700 mb-2'>Gender</h1>
                        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-full h-12 bg-gray-50/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:bg-white focus:border-violet-300 text-base transition-all duration-200">
                                <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                                <SelectGroup>
                                    <SelectItem value="male" className="rounded-lg cursor-pointer hover:bg-gray-50 my-0.5">Male</SelectItem>
                                    <SelectItem value="female" className="rounded-lg cursor-pointer hover:bg-gray-50 my-0.5">Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* Actions Footer */}
                <div className='flex justify-end mt-10 pt-6 border-t border-gray-100'>
                    {
                        loading ? (
                            <Button className='w-full sm:w-auto rounded-full px-8 h-11 bg-violet-400 text-white font-semibold cursor-not-allowed'>
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button 
                                onClick={editProfileHandler} 
                                className='w-full sm:w-auto rounded-full px-8 h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all'
                            >
                                Submit
                            </Button>
                        )
                    }
                </div>
                
            </section>
        </div>
    )
}

export default EditProfile