import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogPortal } from './ui/dialog';
import { X, Loader2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { toast } from 'sonner';

const StoryViewer = ({ open, setOpen, uniqueAuthors, groupedStories, initialAuthorIndex, user, fetchStories }) => {
    const [authorIndex, setAuthorIndex] = useState(0);
    const [storyIndex, setStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (open) {
            setAuthorIndex(initialAuthorIndex);
            setStoryIndex(0);
            setProgress(0);
        }
    }, [open, initialAuthorIndex]);

    const currentAuthor = uniqueAuthors[authorIndex];
    const currentStories = currentAuthor ? groupedStories[currentAuthor._id] : [];
    const currentStory = currentStories[storyIndex];

    const handleNext = () => {
        if (storyIndex < currentStories.length - 1) {
            setStoryIndex(prev => prev + 1);
            setProgress(0);
        } else if (authorIndex < uniqueAuthors.length - 1) {
            setAuthorIndex(prev => prev + 1);
            setStoryIndex(0);
            setProgress(0);
        } else {
            setOpen(false);
        }
    };

    const handleDeleteStory = async () => {
        try {
            const res = await axios.delete(`https://sociova.onrender.com/api/v1/story/delete/${currentStory._id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false); // Close viewer so we don't look at a deleted story
                fetchStories(); // Refresh the top bar
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting story");
        }
    };

    const handlePrev = () => {
        if (storyIndex > 0) {
            setStoryIndex(prev => prev - 1);
            setProgress(0);
        } else if (authorIndex > 0) {
            setAuthorIndex(prev => prev - 1);
            const prevAuthorId = uniqueAuthors[authorIndex - 1]._id;
            setStoryIndex(groupedStories[prevAuthorId].length - 1);
            setProgress(0);
        }
    };

    useEffect(() => {
        if (!open || !currentStory) return;

        const isVideo = currentStory.mediaUrl.match(/\.(mp4|mov|webm)$/i);
        let timer;

        if (!isVideo) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 50);
        }

        return () => clearInterval(timer);
    }, [authorIndex, storyIndex, open, currentStory]);

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* ✅ DialogPortal escapes the overflow-hidden parent */}
            <DialogPortal>
                {/* Custom dark overlay */}
                <div
                    className="fixed inset-0 bg-black/45 backdrop-blur-md z-[99] transition-opacity"
                    onClick={() => setOpen(false)}
                />

                <DialogContent
                    className="max-w-md w-full h-[100dvh] sm:h-[90vh] p-0 bg-black border-0 sm:rounded-[32px] overflow-hidden flex flex-col items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ✅ Securely handle the empty state instead of returning null */}
                    {!currentStory ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                        <>
                            {/* Segmented Progress Bars */}
                            <div className="absolute top-4 left-0 w-full flex gap-1 px-3 z-50">
                                {currentStories.map((_, idx) => (
                                    <div key={idx} className="h-1 flex-1 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
                                        <div
                                            className="h-full bg-white transition-all ease-linear"
                                            style={{
                                                width: idx < storyIndex ? '100%' : idx === storyIndex ? `${progress}%` : '0%'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Header */}
                            <div className="absolute top-8 left-0 w-full flex items-center justify-between px-4 z-50">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 ring-1 ring-white/50">
                                        <AvatarImage src={currentAuthor.profilePicture || defaultPlaceholder} className="object-cover" />
                                        <AvatarFallback><img src={defaultPlaceholder} alt="fallback" /></AvatarFallback>
                                    </Avatar>
                                    <span className="text-white font-bold text-sm drop-shadow-md">{currentAuthor.username}</span>
                                </div>

                                {/* Action Buttons Container */}
                                <div className="flex items-center gap-2 relative z-50">
                                    {/* Only show Trash if the logged-in user owns the story */}
                                    {currentAuthor._id === user?._id && (
                                        <button
                                            onClick={handleDeleteStory}
                                            className="text-white p-2 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors backdrop-blur-sm"
                                        >
                                            <Trash2 size={22} strokeWidth={2.5} />
                                        </button>
                                    )}
                                    <button onClick={() => setOpen(false)} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
                                        <X size={24} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Story Media Center */}
                            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                {currentStory.mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
                                    <video
                                        src={currentStory.mediaUrl}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain"
                                        onTimeUpdate={(e) => {
                                            const { currentTime, duration } = e.target;
                                            setProgress((currentTime / duration) * 100);
                                        }}
                                        onEnded={handleNext}
                                    />
                                ) : (
                                    <img
                                        src={currentStory.mediaUrl}
                                        alt="story"
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>

                            {/* Invisible Click Areas */}
                            <div className="absolute inset-y-0 left-0 w-1/3 z-40 cursor-pointer" onClick={handlePrev} />
                            <div className="absolute inset-y-0 right-0 w-2/3 z-40 cursor-pointer" onClick={handleNext} />
                        </>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

export default StoryViewer;