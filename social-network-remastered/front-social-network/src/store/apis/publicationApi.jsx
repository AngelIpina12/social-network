import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const publicationApi = createApi({
    reducerPath: 'publication',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/publication',
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
            createPublication: builder.mutation({
                query: ({ newPublication }) => {
                    return {
                        url: `/save`,
                        method: 'POST',
                        body: { 
                            text: newPublication.text,
                            user: newPublication.user,
                         },
                    }
                }
            }),
            fetchPublicationDetail: builder.query({
                query: ({ publicationId }) => `/detail/${publicationId}`
            }),
            deletePublication: builder.mutation({
                query: ({ publicationId }) => {
                    return {
                        url: `/remove/${publicationId}`,
                        method: 'DELETE',
                    }
                }
            }),
            fetchUserPublications: builder.query({
                query: ({ publicationId }) => `/user/${publicationId}`
            }),
            uploadPublicationImage: builder.mutation({
                query: ({ publicationId, publication }) => {
                    return {
                        url: `/upload/${publicationId}`,
                        method: 'PUT',
                        body: { publication }
                    }
                }
            }),
            fetchUserFeed: builder.query({
                query: ({ page }) => `/feed/${page}`
            }),
        }
    }
})

export const {
    useCreatePublicationMutation,
    useFetchPublicationDetailQuery,
    useDeletePublicationMutation,
    useFetchUserPublicationsQuery,
    useUploadPublicationImageMutation,
    useFetchUserFeedQuery
} = publicationApi;
export { publicationApi }