import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";
import { publicationApi } from "./apis/publicationApi";
import { publicationReducer, getFeedPublications, getUserPublications } from "./slices/publicationSlice";
import { userApi } from "./apis/userApi";
import { userReducer } from "./slices/userSlice";
import { authReducer } from "./slices/authSlice"
import { counterReducer } from "./slices/counterSlice"


const store = configureStore({
    reducer: {
        followData: followReducer,
        [followApi.reducerPath]: followApi.reducer,
        publicationData: publicationReducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        userData: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        authData: authReducer,
        countersData: counterReducer
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
    setCurrentPage,
    setSelectedPublication,
    clearSelectedPublication,
    getFeedPublications,
    getUserPublications
} from './slices/publicationSlice';
export {
    resetUsers,
    setCurrentPage as setUserPage
} from './slices/userSlice';
export {
    logout,
    setUser
} from './slices/authSlice';
export {
    updateCounters
} from './slices/counterSlice'
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
    useFetchUserFeedQuery,
    useLazyFetchUserFeedQuery
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
    useLazyFetchCountersQuery
} from './apis/userApi'

export default store;