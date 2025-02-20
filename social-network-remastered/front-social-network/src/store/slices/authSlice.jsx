import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { publicationApi } from '../apis/publicationApi';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  counter: {},
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          const { token, user } = payload;
          const { password, id, ...rest } = user;
          state.token = token;
          state.user = { _id: id, ...rest };
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      )
      .addMatcher(
        userApi.endpoints.fetchUserProfile.matchFulfilled,
        (state, { payload }) => {
          const { user } = payload;
          const fetchedUserId = user._id || user.id;
          if (state.user && state.user._id === fetchedUserId) {
            const { password, _id, ...rest } = user;
            state.user = { _id, ...rest };
            localStorage.setItem('user', JSON.stringify(state.user));
          }
        }
      )
      .addMatcher(
        userApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          const { user } = payload;
          const { password, ...userWithoutPassword } = user;
          state.user = userWithoutPassword;
        }
      )
      .addMatcher(
        userApi.endpoints.fetchCounters.matchFulfilled,
        (state, { payload }) => {
          state.counter = {
            following: payload.following,
            followed: payload.followed,
            publications: payload.publications
          };
        }
      )
      .addMatcher(
        userApi.endpoints.uploadUserImage.matchFulfilled,
        (state, { payload }) => {
          const { user } = payload;
          const { password, ...userWithoutPassword } = user;
          state.user = userWithoutPassword;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      )
      .addMatcher(
        publicationApi.endpoints.createPublication.matchFulfilled,
        (state, { payload }) => {
          if (state.user && payload.publication.user === state.user._id) {
            if (state.counter && typeof state.counter.publications === 'number') {
              state.counter.publications++;
            } else {
              state.counter.publications = 1;
            }
          }
        }
      )
  }
});

export const {
  logout,
  setUser
} = authSlice.actions;
export const authReducer = authSlice.reducer;