import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({ comment }) => {
    
    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    if (!comment.author) {
        return (
            <div className="text-gray-400 text-sm italic py-2 px-3 bg-gray-50/50 rounded-lg border border-gray-100 my-2 w-max shadow-sm">
                [Comment by deleted user]
            </div>
        );
    }

    return (
        <div className='my-3 group'>
            {/* Changed from items-center to items-start so long comments align properly with the avatar at the top */}
            <div className='flex gap-3 items-start p-2 -ml-2 rounded-xl hover:bg-gray-50 transition-colors duration-200'>
                
                <Avatar className="h-8 w-8 ring-1 ring-black/5 shadow-sm shrink-0 mt-0.5">
                    {/* Profile photo  */}
                    <AvatarImage src={comment?.author?.profilePicture || defaultPlaceholder} className="object-cover" />
                    <AvatarFallback>
                        <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                    <h1 className='text-sm text-gray-800 leading-relaxed break-words'>
                        <span className='font-bold hover:underline cursor-pointer mr-1.5'>
                            {comment?.author.username || "Deleted User"}
                        </span>
                        <span className='font-normal text-gray-700'>
                            {comment?.text}
                        </span>
                    </h1>
                </div>
                
            </div>
        </div>
    )
}

export default Comment