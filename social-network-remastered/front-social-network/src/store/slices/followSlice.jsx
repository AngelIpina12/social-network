import { createSlice } from '@reduxjs/toolkit';
import { followApi } from '../../store/apis/followApi';

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
        incrementFollowingsPage: (state) => {
            state.followings.page += 1;
        },
        incrementFollowersPage: (state) => {
            state.followers.page += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                followApi.endpoints.fetchUserFollowings.matchPending,
                (state) => {
                    state.followings.loading = true;
                    state.followings.error = null;
                }
            )
            .addMatcher(
                followApi.endpoints.fetchUserFollowings.matchFulfilled,
                (state, { payload, meta }) => {
                    const currentPage = meta.arg.page;
                    const followedUsers = payload.follows.map(f => f.followed);
                    if (currentPage === 1) {
                        state.followings.data = followedUsers;
                    } else {
                        state.followings.data = [
                            ...state.followings.data,
                            ...followedUsers.filter(
                                newUser => !state.followings.data.some(existing => existing._id === newUser._id)
                            ),
                        ];
                    }
                    state.followings.page = currentPage;
                    state.followings.totalPages = payload.pages;
                    state.followings.loading = false;
                }
            )
            .addMatcher(
                followApi.endpoints.fetchUserFollowings.matchRejected,
                (state, action) => {
                    state.followings.loading = false;
                    state.followings.error = action.error.message;
                }
            )
            .addMatcher(
                followApi.endpoints.fetchUserFollowers.matchPending,
                (state) => {
                    state.followers.loading = true;
                    state.followers.error = null;
                }
            )
            .addMatcher(
                followApi.endpoints.fetchUserFollowers.matchFulfilled,
                (state, { payload, meta }) => {
                    const currentPage = meta.arg.page;
                    const followerUsers = payload.follows.map(f => f.user);
                    if (currentPage === 1) {
                        state.followers.data = followerUsers;
                    } else {
                        state.followers.data = [
                            ...state.followers.data,
                            ...followerUsers.filter(
                                newUser => !state.followers.data.some(existing => existing._id === newUser._id)
                            ),
                        ];
                    }
                    state.followers.page = currentPage;
                    state.followers.totalPages = payload.pages;
                    state.followers.loading = false;
                }
            )
            .addMatcher(
                followApi.endpoints.fetchUserFollowers.matchRejected,
                (state, action) => {
                    state.followers.loading = false;
                    state.followers.error = action.error.message;
                }
            );
    }
});

export const {
    addFollowing,
    removeFollowing,
    setFollowings,
    setFollowers,
    incrementFollowingsPage,
    incrementFollowersPage,
} = followSlice.actions;
export const followReducer = followSlice.reducer;