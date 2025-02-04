import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const followApi = createApi({
    reducerPath: 'follow',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api',
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
            fetchUserFollowing: builder.query({
                query: ({ id, page }) => `/follow/following/${id}/${page}`
            }),
        }
    }
})

export const {
    useFetchUserFollowingQuery
} = followApi;
export { followApi }