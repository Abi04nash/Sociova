import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import MobileRightSidebar from './MobileRightSidebar';
import { useState } from 'react';


const Home = () => {
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className=' flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home