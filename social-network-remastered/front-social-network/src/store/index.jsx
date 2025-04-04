import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './apis/baseApi';
import { followReducer } from "./slices/followSlice";
import { publicationReducer } from "./slices/publicationSlice";
import { userReducer } from "./slices/userSlice";
import { authReducer } from "./slices/authSlice";
import { counterReducer } from "./slices/counterSlice";

export * from './apis/userApi';
export * from './apis/publicationApi';
export * from './apis/followApi';

export {
  addFollowing,
  removeFollowing,
  setFollowings,
  setFollowers,
  incrementFollowingsPage,
  incrementFollowersPage,
  resetFollowState,
} from './slices/followSlice';

export {
  addPublication,
  setCurrentPage,
  setSelectedPublication,
  clearSelectedPublication,
  removePublication,
  resetPublicationState,
  getFeedPublications,
  getUserPublications,
} from './slices/publicationSlice';

export {
  resetUsers,
  setCurrentPage as setUserPage,
} from './slices/userSlice';

export {
  logout,
  setUser,
} from './slices/authSlice';

export {
  updateCounters,
} from './slices/counterSlice';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    followData: followReducer,
    publicationData: publicationReducer,
    userData: userReducer,
    authData: authReducer,
    countersData: counterReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export default store;