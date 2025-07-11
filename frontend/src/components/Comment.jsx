import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({ comment }) => {

    if (!comment.author) {
  return (
    <div className="text-gray-400 text-sm italic">
      [Comment by deleted user]
    </div>
  );
}

    
    return (
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    {/* Profile photo  */}
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback><img src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" alt="" /></AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{comment?.author.username || "Deleted User"} <span className='font-normal pl-1'>{comment?.text}</span></h1>
            </div>
        </div>
    )
}

export default Comment