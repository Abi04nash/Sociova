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
        // ✅ for updating only bookmarks in user
        updateBookmarks: (state, action) => {
            if (state.user) {
                state.user.bookmarks = action.payload; // 🔄 Update only bookmarks
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

        // ✅ NEW: Add follow/unfollow toggle logic
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
  const profileId = action.payload.loggedInUserId;
  const targetProfile = state.userProfile;

  if (!targetProfile || !profileId) return;

  const isAlreadyFollower = targetProfile.followers.includes(profileId);

  if (isAlreadyFollower) {
    targetProfile.followers = targetProfile.followers.filter(id => id !== profileId);
  } else {
    targetProfile.followers.push(profileId);
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
    updateFollowing, // ✅ Add this
    toggleFollower, // ✅ add this
} = authSlice.actions;
export default authSlice.reducer;