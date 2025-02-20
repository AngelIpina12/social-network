import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../../store/apis/userApi';

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
          }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchFulfilled,
                (state, { payload, meta }) => {
                    const { users, user_following, pages, page } = payload;
                    if (page === 1) {
                        state.users = users;
                    } else {
                        state.users = [
                            ...state.users,
                            ...users.filter(newUser => !state.users.some(existing => existing._id === newUser._id))
                        ];
                    }
                    state.following = user_following;
                    state.pages = pages;
                    state.currentPage = page;
                }
            )
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchFulfilled,
                (state) => {
                    state.loading = false;
                }
            );
    }
});

export const {
    resetUsers,
    setCurrentPage
} = userSlice.actions;
export const userReducer = userSlice.reducer;