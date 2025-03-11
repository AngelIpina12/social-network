import { baseApi } from './baseApi';

export const followApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserFollowings: builder.query({
            query: ({ userId, page }) => `follow/following/${userId}/${page}`,
            providesTags: (result, error, arg) => [
                { type: 'Follow', id: `following_${arg.userId}` },
            ],
        }),
        fetchUserFollowers: builder.query({
            query: ({ userId, page }) => `follow/followers/${userId}/${page}`,
            providesTags: (result, error, arg) => [
                { type: 'Follow', id: `followers_${arg.userId}` },
            ],
        }),
        createUserFollow: builder.mutation({
            query: ({ userId }) => ({
                url: 'follow/save',
                method: 'POST',
                body: {
                    followed: userId,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Follow', id: 'LIST' },
                { type: 'Counter', id: arg.userId },
                { type: 'Counter', id: 'CURRENT_USER' },
                { type: 'Feed', id: 'LIST' },
            ],
        }),
        deleteUserFollow: builder.mutation({
            query: ({ userId }) => ({
                url: `follow/unfollow/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Follow', id: 'LIST' },
                { type: 'Counter', id: arg.userId },
                { type: 'Counter', id: 'CURRENT_USER' },
                { type: 'Feed', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useFetchUserFollowingsQuery,
    useFetchUserFollowersQuery,
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation,
} = followApi;