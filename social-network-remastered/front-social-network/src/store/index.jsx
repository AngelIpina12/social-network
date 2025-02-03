import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { userFollowing } from './slices/followSlice'
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";

export const store = configureStore({
    reducer: {
        follow: followReducer,
        [followApi.reducerPath]: followApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(followApi.middleware)
    }
});

setupListeners(store.dispatch);

export {
    userFollowing
};
export {
    useFetchUserFollowingQuery
} from './apis/followApi';