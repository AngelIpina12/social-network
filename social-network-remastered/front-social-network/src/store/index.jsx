import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { followApi } from './apis/followApi';
import { followReducer } from "./slices/followSlice";
import { publicationApi } from "./apis/publicationApi";
import { publicationReducer } from "./slices/publicationSlice";
import { userApi } from "./apis/userApi";
import { userReducer } from "./slices/userSlice";

const store = configureStore({
    reducer: {
        followData: followReducer,
        [followApi.reducerPath]: followApi.reducer,
        publicationData: publicationReducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        userData: userReducer,
        [userApi.reducerPath]: userApi.reducer,
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
    addUser,
    removeUser,
    setUsers
} from './slices/userSlice';
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
    useFetchListOfUsersQuery,
    useUpdateUserMutation,
    useUploadUserImageMutation,
    useFetchCountersQuery,
} from './apis/userApi'

export default store;