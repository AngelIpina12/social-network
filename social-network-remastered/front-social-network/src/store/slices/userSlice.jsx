import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';

const initialState = {
    users: [],
    following: [],
    currentPage: 1,
    pages: 0,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUsers(state) {
            state.users = [];
            state.following = [];
            state.currentPage = 1;
            state.pages = 0;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchFulfilled,
                (state, { payload, meta }) => {
                    const { users, user_following, pages, page } = payload;

                    if (page === 1) {
                        state.users = users;
                    } else {
                        const uniqueUsers = {};
                        [...state.users, ...users].forEach(user => {
                            uniqueUsers[user._id] = user;
                        });
                        state.users = Object.values(uniqueUsers);
                    }

                    state.following = user_following;
                    state.pages = pages;
                    state.currentPage = page;
                    state.loading = false;
                }
            )
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message;
                }
            );
    },
});

export const { resetUsers, setCurrentPage } = userSlice.actions;
export const userReducer = userSlice.reducer;