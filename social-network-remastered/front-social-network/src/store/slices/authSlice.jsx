import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';

const initialState = {
  user: null,
  token: null,
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
          const { password, ...userWithoutPassword } = user;
          state.token = token;
          state.user = userWithoutPassword;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        }
      )
      .addMatcher(
        userApi.endpoints.fetchUserProfile.matchFulfilled,
        (state, { payload }) => {
          const { user } = payload;
          const { password, ...userWithoutPassword } = user;
          state.user = userWithoutPassword;
        }
      )
      .addMatcher(
        userApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          const { user } = payload;
          const { password, ...userWithoutPassword } = user;
          state.user = userWithoutPassword;
        }
      );
  }
});

export const { 
    logout, 
    setUser 
} = authSlice.actions;
export const authReducer = authSlice.reducer;