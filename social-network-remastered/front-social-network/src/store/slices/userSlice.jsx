import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../../store/apis/userApi';

const initialState = {
    users: [],
    following: [],
    currentPage: 1,
    totalPages: 0,
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
            state.totalPages = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                userApi.endpoints.fetchListOfUsers.matchFulfilled,
                (state, { payload, meta }) => {
                    // Suponemos que payload contiene { users, user_following, totalPages, page }
                    const { users, user_following, totalPages, page } = payload;
                    if (page === 1) {
                        state.users = users;
                    } else {
                        state.users = [
                            ...state.users,
                            ...users.filter(newUser => !state.users.some(existing => existing._id === newUser._id))
                        ];
                    }
                    state.following = user_following;
                    state.totalPages = totalPages;
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
    resetUsers
} = userSlice.actions;
export const userReducer = userSlice.reducer;