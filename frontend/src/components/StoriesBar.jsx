import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import StoryViewer from './StoryViewer';
import { useSelector } from 'react-redux';

const StoriesBar = () => {
    const { user } = useSelector(store => store.auth);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [initialAuthorIndex, setInitialAuthorIndex] = useState(0);
    const fileRef = useRef();

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    const fetchStories = async () => {
        try {
            const res = await axios.get('https://sociova.onrender.com/api/v1/story/all', { withCredentials: true });
            if (res.data.success) {
                setStories(res.data.stories);
            }
        } catch (error) {
            console.log("Error fetching stories:", error);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const uniqueAuthors = [];
    const groupedStories = {};

    stories.forEach(story => {
        const authorId = story.author._id;
        if (!groupedStories[authorId]) {
            groupedStories[authorId] = [];
            uniqueAuthors.push(story.author);
        }
        groupedStories[authorId].push(story);
    });

    const handleUploadStory = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            toast.error("File size is too large. Please select a video under 50MB.");
            e.target.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const res = await axios.post('https://sociova.onrender.com/api/v1/story/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Story uploaded successfully!");
                fetchStories();
            }
        } catch (error) {
            toast.error("Failed to upload story");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-4 mb-6 w-full max-w-md mx-auto overflow-hidden">
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 pt-1 items-center">

                <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0" onClick={() => fileRef.current.click()}>
                    <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-transparent">
                            <AvatarImage src={user?.profilePicture || defaultPlaceholder} className="object-cover" />
                            <AvatarFallback><img src={defaultPlaceholder} alt="fallback" /></AvatarFallback>
                        </Avatar>

                        <div className="absolute bottom-0 right-0 bg-violet-600 border-2 border-white rounded-full p-1 shadow-sm">
                            {loading ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Plus className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 text-center w-16 truncate">Your Story</span>

                    <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                        onChange={handleUploadStory}
                        accept="image/*, video/*"
                    />
                </div>

                {uniqueAuthors.map((author, index) => (
                    <div
                        key={author._id}
                        className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
                        onClick={() => {
                            setInitialAuthorIndex(index);
                            setViewerOpen(true);
                        }}
                    >
                        {/* Instagram-style gradient ring */}
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-violet-600 group-hover:scale-105 transition-transform duration-200">
                            <Avatar className="h-[60px] w-[60px] border-2 border-white">
                                <AvatarImage src={author.profilePicture || defaultPlaceholder} className="object-cover" />
                                <AvatarFallback><img src={defaultPlaceholder} alt="fallback" /></AvatarFallback>
                            </Avatar>
                        </div>
                        <span className="text-xs font-medium text-gray-800 text-center w-16 truncate">
                            {author._id === user?._id ? "You" : author.username}
                        </span>
                    </div>
                ))}

            </div>

            {uniqueAuthors.length > 0 && (
                <StoryViewer
                    open={viewerOpen}
                    setOpen={setViewerOpen}
                    uniqueAuthors={uniqueAuthors}
                    groupedStories={groupedStories}
                    initialAuthorIndex={initialAuthorIndex}
                    user={user}
                    fetchStories={fetchStories}
                />
            )}

        </div>
    );
};


export default StoriesBar;


