import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/post/all', {
          withCredentials: true
        });
        
        if (res.data.success) {
          const postsWithBookmarks = res.data.posts.map(post => ({
            ...post,
            isBookmarked: res.data.userBookmarks.includes(post._id) // <-- ✅ add isBookmarked flag
          }));
          
          dispatch(setPosts(postsWithBookmarks));
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchAllPost();
  }, []);
};

export default useGetAllPost;
