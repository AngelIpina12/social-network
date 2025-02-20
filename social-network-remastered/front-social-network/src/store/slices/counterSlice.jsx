import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { publicationApi } from '../apis/publicationApi';

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
        builder.addMatcher(
            userApi.endpoints.fetchCounters.matchFulfilled,
            (state, { payload }) => {
                const userId = payload.userId;
                state[userId] = {
                    following: payload.following,
                    followed: payload.followed,
                    publications: payload.publications,
                };

            }
        );
        builder.addMatcher(
            publicationApi.endpoints.createPublication.matchFulfilled,
            (state, { payload }) => {
                const userId = payload.publication.user;
                if (state[userId] && typeof state[userId].publications === 'number') {
                    state[userId].publications++;
                }
            }
        );
    },
});

export const { updateCounters } = countersSlice.actions;
export const counterReducer = countersSlice.reducer;