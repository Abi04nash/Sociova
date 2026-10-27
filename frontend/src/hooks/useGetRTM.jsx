import { setMessages } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/rtnSlice"; // Import the action
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages } = useSelector(store => store.chat);
    
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        });

        socket?.on('notification', (notification) => {
            dispatch(setLikeNotification(notification));
        });

        return () => {
            socket?.off('newMessage');
            socket?.off('notification'); 
        }
    }, [messages, dispatch, socket]);
};
export default useGetRTM;