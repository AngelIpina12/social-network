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
        }
    }
})

export const {
    useFetchUserFollowingsQuery,
    useFetchUserFollowersQuery
} = followApi;
export { followApi }