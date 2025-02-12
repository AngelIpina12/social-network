import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";
import { publicationApi } from "./apis/publicationApi";
import { publicationReducer } from "./slices/publicationSlice";

const store = configureStore({
    reducer: {
        followData: followReducer,
        [followApi.reducerPath]: followApi.reducer,
        publicationData: publicationReducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(followApi.middleware)
            .concat(publicationApi.middleware)
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
} from './slices/followSlice';
export {
    addPublication,
    removePublication,
    setPublications
} from './slices/publicationSlice';
export {
    useFetchUserFollowingsQuery,
    useFetchUserFollowersQuery,
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation
} from './apis/followApi';
export {
    useCreatePublicationMutation,
    useFetchPublicationDetailQuery,
    useDeletePublicationMutation,
    useFetchUserPublicationsQuery,
    useUploadPublicationImageMutation,
    useFetchUserFeedQuery
} from './apis/publicationApi'

export default store;