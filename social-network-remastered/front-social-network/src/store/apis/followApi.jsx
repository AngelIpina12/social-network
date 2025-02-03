import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const followApi = createApi({
    reducerPath: 'follow',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:27017'
    }),
    endpoints(builder) {
        return {
            fetchUserFollowing: builder.query({
                query: (data) => {
                    return {
                        url: '/follow/following',
                        params: {
                            userId: data.userId,
                            nextPage: data.nextPage
                        },
                        method: 'GET',
                    }
                },
            }),
        }
    }
})

export const {
    useFetchUserFollowingQuery
} = followApi;
export { followApi }