import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [], 
    },
    reducers: {
        setLikeNotification: (state, action) => {
            // Handle 'like' and 'message'
            if (action.payload.type === 'like' || action.payload.type === 'message') {
                state.likeNotification.push(action.payload);
            } 
            else if (action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
            }
        },
        clearNotifications: (state) => {
            state.likeNotification = [];
        }
    }
});

export const { setLikeNotification, clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;