import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";
import { publicationApi } from "./apis/publicationApi";
import { publicationReducer } from "./slices/publicationSlice";
import { userApi } from "./apis/userApi";
import { userReducer } from "./slices/userSlice";
import { authReducer } from "./slices/authSlice"

const store = configureStore({
    reducer: {
        followData: followReducer,
        [followApi.reducerPath]: followApi.reducer,
        publicationData: publicationReducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        userData: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        authData: authReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(followApi.middleware)
            .concat(publicationApi.middleware)
            .concat(userApi.middleware)
    }
});

setupListeners(store.dispatch);

export {
    addFollowing,
    removeFollowing,
    setFollowings,
    setFollowers,
    incrementFollowingsPage,
    incrementFollowersPage
} from './slices/followSlice';
export {
    addPublication,
    removePublication,
    setPublications
} from './slices/publicationSlice';
export {
    resetUsers,
    setCurrentPage
} from './slices/userSlice';
export {
    logout,
    setUser
} from './slices/authSlice';
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
export {
    useCreateUserMutation,
    useLoginUserMutation,
    useFetchUserProfileQuery,
    useLazyFetchUserProfileQuery,
    useFetchListOfUsersQuery,
    useUpdateUserMutation,
    useUploadUserImageMutation,
    useFetchCountersQuery,
} from './apis/userApi'

export default store;