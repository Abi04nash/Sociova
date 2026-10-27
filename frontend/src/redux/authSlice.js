import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        // actions
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        updateBookmarks: (state, action) => {
            if (state.user) {
                state.user.bookmarks = action.payload; 
            }
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },

        updateFollowing: (state, action) => {
            const targetUserId = action.payload;

            if (!state.user) return;

            const isFollowing = state.user.following?.includes(targetUserId);

            if (isFollowing) {
                // Unfollow
                state.user.following = state.user.following.filter(id => id !== targetUserId);
            } else {
                // Follow
                state.user.following.push(targetUserId);
            }
        },
        toggleFollower: (state, action) => {
            const loggedInUser = action.payload; // Pass the user object now
            const targetProfile = state.userProfile;

            if (!targetProfile || !loggedInUser?._id) return;

            const isAlreadyFollower = targetProfile.followers.some(
                (follower) => follower._id === loggedInUser._id
            );

            if (isAlreadyFollower) {
                targetProfile.followers = targetProfile.followers.filter(
                    (follower) => follower._id !== loggedInUser._id
                );
            } else {
                targetProfile.followers.push(loggedInUser);
            }
        },

    }
});
export const {
    setAuthUser,
    updateBookmarks,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser,
    updateFollowing, // Added
    toggleFollower, // Added
} = authSlice.actions;
export default authSlice.reducer;