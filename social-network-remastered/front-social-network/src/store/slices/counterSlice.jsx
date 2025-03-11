import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { publicationApi } from '../apis/publicationApi';
import { followApi } from '../apis/followApi';

const initialState = {};

const countersSlice = createSlice({
    name: 'counters',
    initialState,
    reducers: {
        updateCounters(state, action) {
            const { userId, counters } = action.payload;
            state[userId] = counters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                userApi.endpoints.fetchCounters.matchFulfilled,
                (state, { payload }) => {
                    const userId = payload.userId;
                    state[userId] = {
                        following: payload.following,
                        followed: payload.followed,
                        publications: payload.publications,
                    };
                }
            )
            .addMatcher(
                publicationApi.endpoints.createPublication.matchFulfilled,
                (state, { payload }) => {
                    const userId = payload.publication.user;
                    if (state[userId] && typeof state[userId].publications === 'number') {
                        state[userId].publications++;
                    }
                }
            )
            .addMatcher(
                publicationApi.endpoints.deletePublication.matchFulfilled,
                (state, { payload, meta }) => {
                    const currentUserId = localStorage.getItem('user') ?
                        JSON.parse(localStorage.getItem('user'))._id : null;

                    if (currentUserId && state[currentUserId] && state[currentUserId].publications > 0) {
                        state[currentUserId].publications--;
                    }
                }
            )
            .addMatcher(
                followApi.endpoints.createUserFollow.matchFulfilled,
                (state, { payload, meta }) => {
                    const followerId = payload.follow.user;
                    const followedId = payload.follow.followed;
                    if (state[followerId]) {
                        state[followerId].following = (state[followerId].following || 0) + 1;
                    }
                    if (state[followedId]) {
                        state[followedId].followed = (state[followedId].followed || 0) + 1;
                    }
                }
            )
            .addMatcher(
                followApi.endpoints.deleteUserFollow.matchFulfilled,
                (state, { payload, meta }) => {
                    const unfollowedId = meta.arg.userId;
                    const currentUserId = localStorage.getItem('user') ?
                        JSON.parse(localStorage.getItem('user'))._id : null;
                    if (currentUserId && state[currentUserId] && state[currentUserId].following > 0) {
                        state[currentUserId].following--;
                    }
                    if (unfollowedId && state[unfollowedId] && state[unfollowedId].followed > 0) {
                        state[unfollowedId].followed--;
                    }
                }
            );
    },
});

export const { updateCounters } = countersSlice.actions;
export const counterReducer = countersSlice.reducer;