import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  
  const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

  return (
    // Hidden on mobile/tablet, displayed beautifully on large desktop screens
    <div className='bg-slate-100 rounded-2xl m-2 hidden lg:block w-[300px] xl:w-[350px] my-10 pr-6 pl-2'>
      
      {/* Current User Mini Profile Card */}
      <div className='flex items-center gap-4 bg-transparent rounded-2xl p-2 mb-6 group'>
        <Link to={`/profile/${user?._id}`} className="shrink-0">
          <Avatar className="h-14 w-14 ring-1 ring-black/5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <AvatarImage 
                src={user?.profilePicture || defaultPlaceholder} 
                alt="profile_image" 
                className="object-cover" 
            />
            <AvatarFallback>
                <img 
                    src={defaultPlaceholder} 
                    alt="fallback" 
                    className="object-cover h-full w-full" 
                />
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className='flex flex-col min-w-0'>
          <h1 className='font-bold text-sm text-gray-900 truncate leading-tight'>
            <Link to={`/profile/${user?._id}`} className="hover:text-gray-500 transition-colors">
                {user?.username}
            </Link>
          </h1>
          <span className='text-gray-500 text-xs font-medium truncate max-w-[180px] mt-0.5'>
            {user?.bio || 'Bio here...'}
          </span>
        </div>
        
        {/* Optional decorative switch text (invisible but keeps flex spacing perfect) */}
        <div className="ml-auto text-xs font-bold text-violet-600 hover:text-violet-900 cursor-pointer transition-colors">
            {/* If you ever want to add a "Switch" button logic here, it's perfectly positioned */}
        </div>
      </div>
      
      {/* Suggested Users Section */}
      <div className="px-2">
          <SuggestedUsers />
      </div>

    </div>
  )
}

export default RightSidebar