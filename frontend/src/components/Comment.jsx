import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

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
        <div className='flex flex-col w-full mb-3 mt-1'>
            {/* Row 1: Profile Picture & Username (Both Clickable) */}
            <div className='flex items-center gap-3 mb-1.5'>
                <Link to={`/profile/${comment?.author?._id}`}>
                    <Avatar className="h-9 w-9 ring-1 ring-black/5 hover:opacity-80 transition-opacity cursor-pointer shadow-sm">
                        <AvatarImage 
                            src={comment?.author?.profilePicture || defaultPlaceholder} 
                            className="object-cover" 
                        />
                        <AvatarFallback>
                            <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                        </AvatarFallback>
                    </Avatar>
                </Link>
                
                <Link 
                    to={`/profile/${comment?.author?._id}`} 
                    className='font-bold text-sm text-gray-900 hover:text-violet-600 transition-colors'
                >
                    {comment?.author?.username}
                </Link>
            </div>

            {/* Row 2: Comment Text (Styled as a clean bubble below the name) */}
            <div className="ml-12 mr-4">
                <div className="text-sm text-gray-800 leading-relaxed bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl rounded-tl-sm px-4 py-2.5 inline-block max-w-full break-words">
                    {comment?.text}
                </div>
            </div>
        </div>
    )
}

export default Comment
