import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post('https://sociova.onrender.com/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4 font-sans'>
            <form 
                onSubmit={signupHandler} 
                className='bg-white/80 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-8 sm:p-10 flex flex-col gap-6 transition-all mt-4 mb-4'
            >
                {/* Header Section */}
                <div className='flex flex-col items-center justify-center space-y-2 mb-2'>
                    <h1 className='font-extrabold text-4xl tracking-tight'>
                        <span className='bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm'>
                            Sociova
                        </span>
                    </h1>
                    <p className='text-sm text-center text-gray-500 font-medium leading-relaxed max-w-[280px]'>
                        Sign up to start sharing your moments on <span className='font-bold bg-gradient-to-tr from-violet-600 to-pink-500 bg-clip-text text-transparent'>Sociova</span>
                    </p>
                </div>

                {/* Input Fields */}
                <div className='space-y-4 w-full'>
                    <div className='flex flex-col space-y-1.5'>
                        <label className='font-semibold text-sm text-gray-700 ml-1'>Username</label>
                        <Input
                            type="text"
                            name="username"
                            value={input.username}
                            onChange={changeEventHandler}
                            placeholder="Choose a username"
                            className="h-12 bg-gray-50/50 border-gray-200/80 rounded-2xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-400 transition-all duration-200 px-4 text-base placeholder:text-gray-400"
                        />
                    </div>
                    
                    <div className='flex flex-col space-y-1.5'>
                        <label className='font-semibold text-sm text-gray-700 ml-1'>Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="h-12 bg-gray-50/50 border-gray-200/80 rounded-2xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-400 transition-all duration-200 px-4 text-base placeholder:text-gray-400"
                        />
                    </div>
                    
                    <div className='flex flex-col space-y-1.5'>
                        <label className='font-semibold text-sm text-gray-700 ml-1'>Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Create a password"
                            className="h-12 bg-gray-50/50 border-gray-200/80 rounded-2xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-400 transition-all duration-200 px-4 text-base placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className='mt-2'>
                    {
                        loading ? (
                            <Button disabled className='w-full h-12 rounded-2xl bg-violet-400 text-white font-semibold text-base shadow-sm'>
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                Please wait...
                            </Button>
                        ) : (
                            <Button 
                                type='submit' 
                                className='w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-md shadow-violet-500/25 active:scale-[0.98] transition-all duration-200'
                            >
                                Signup
                            </Button>
                        )
                    }
                </div>

                {/* Footer Link */}
                <div className='text-center mt-1'>
                    <span className='text-sm text-gray-500 font-medium'>
                        Already have an account?{' '}
                        <Link to="/login" className='text-violet-600 font-bold hover:text-violet-700 hover:underline transition-colors'>
                            Login
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default Signup