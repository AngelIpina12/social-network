import { createSlice } from '@reduxjs/toolkit';

const followSlice = createSlice({
    name: 'follow',
    initialState: {
        followings: {
            data: [],
            page: 1,
            totalPages: 0,
            loading: false,
            error: null,
        },
        followers: {
            data: [],
            page: 1,
            totalPages: 0,
            loading: false,
            error: null,
        },
    },
    reducers: {
        addFollowing: (state, action) => {
            if (!state.followings.data.find(user => user._id === action.payload._id)) {
                state.followings.data.push(action.payload);
              }
        },
        removeFollowing: (state, action) => {
            state.followings.data = state.followings.data.filter(
                user => user._id !== action.payload
            );
        },
        setFollowings: (state, action) => {
            state.followings.data = action.payload.data;
            state.followings.page = action.payload.page;
            state.followings.totalPages = action.payload.totalPages;
        },
        setFollowers: (state, action) => {
            state.followers.data = action.payload.data;
            state.followers.page = action.payload.page;
            state.followers.totalPages = action.payload.totalPages;
        },
        setFollowingsLoading: (state, action) => {
            state.followings.loading = action.payload;
        },
        setFollowersLoading: (state, action) => {
            state.followers.loading = action.payload;
        },
        setFollowingsError: (state, action) => {
            state.followings.error = action.payload;
        },
        setFollowersError: (state, action) => {
            state.followers.error = action.payload;
        },
    }
});

export const {
    addFollowing,
    removeFollowing,
    setFollowings,
    setFollowers,
    setFollowingsLoading,
    setFollowersLoading,
    setFollowingsError,
    setFollowersError,
} = followSlice.actions;
export const followReducer = followSlice.reducer;