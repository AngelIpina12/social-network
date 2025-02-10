import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    addFollowing,
    removeFollowing,
    setFollowings,
    setFollowers,
    setFollowingsLoading,
    setFollowersLoading,
    setFollowingsError,
    setFollowersError
} from './slices/followSlice'
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";

const store = configureStore({
    reducer: {
        followData: followReducer,
        [followApi.reducerPath]: followApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(followApi.middleware)
    }
});

setupListeners(store.dispatch);

export {
    addFollowing,
    removeFollowing,
    setFollowings,
    setFollowers,
    setFollowingsLoading,
    setFollowersLoading,
    setFollowingsError,
    setFollowersError,
};
export {
    useFetchUserFollowingsQuery,
    useFetchUserFollowersQuery,
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation
} from './apis/followApi';

export default store;