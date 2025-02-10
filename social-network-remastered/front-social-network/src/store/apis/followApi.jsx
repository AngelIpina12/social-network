import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const followApi = createApi({
    reducerPath: 'follow',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/follow',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints(builder) {
        return {
            fetchUserFollowings: builder.query({
                query: ({ userId, page }) => `/following/${userId}/${page}`
            }),
            fetchUserFollowers: builder.query({
                query: ({ userId, page }) => `/followers/${userId}/${page}`
            }),
            createUserFollow: builder.mutation({
                query: ({ userId }) => {
                    return {
                        url: `/save`,
                        method: 'POST',
                        body: {
                            followed: userId
                        }
                    }
                }
            }),
            deleteUserFollow: builder.mutation({
                query: ({ userId }) => {
                    return {
                        url: `/unfollow/${userId}`,
                        method: 'DELETE',
                    }
                }
            })
        }
    }
})

export const {
    useFetchUserFollowingsQuery,
    useFetchUserFollowersQuery,
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation
} = followApi;
export { followApi }