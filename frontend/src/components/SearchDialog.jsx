import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchDialog = ({ open, setOpen }) => {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const defaultPlaceholder = "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=";

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchText.trim()) {
                setResults([]);
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get(`https://sociova.onrender.com/api/v1/user/search?keyword=${searchText}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setResults(res.data.users);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        // Added a small delay (debounce) so it doesn't spam the backend on every keystroke
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchText]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl border-0 top-[10%] translate-y-0" onInteractOutside={() => setOpen(false)}>
                
                {/* Search Input Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 text-gray-400 w-5 h-5" strokeWidth={2} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            autoFocus
                            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all text-gray-900"
                        />
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] min-h-[300px] overflow-y-auto p-2 custom-scrollbar bg-white">
                    {loading ? (
                        <div className="flex justify-center items-center h-full mt-20">
                            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {results.map((user) => (
                                <Link 
                                    to={`/profile/${user._id}`} 
                                    key={user._id} 
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <Avatar className="h-12 w-12 ring-1 ring-black/5 group-hover:ring-violet-200 transition-all">
                                        <AvatarImage src={user.profilePicture || defaultPlaceholder} className="object-cover" />
                                        <AvatarFallback>
                                            <img src={defaultPlaceholder} alt="fallback" className="object-cover h-full w-full" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-900 group-hover:text-violet-600 transition-colors">{user.username}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : searchText ? (
                        <div className="flex flex-col justify-center items-center h-full mt-20 text-gray-400">
                            <Search className="w-10 h-10 mb-3 opacity-20" />
                            <p className="text-sm font-medium">No users found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full mt-20 text-gray-400">
                            <p className="text-sm font-medium">Type a username to search</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;