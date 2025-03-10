import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createEntityAdapter } from '@reduxjs/toolkit';

export const publicationsAdapter = createEntityAdapter({
    selectId: (publication) => publication._id,
    sortComparer: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
});

const initialState = publicationsAdapter.getInitialState({
    totalPages: 0,
    currentPage: 1
});

export const publicationSelectors = publicationsAdapter.getSelectors();

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
    tagTypes: ['Publication', 'UserPublications', 'Feed'],
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
                },
                invalidatesTags: [
                    { type: 'Publication', id: 'LIST' },
                    { type: 'Feed', id: 'LIST' },
                    { type: 'UserPublications', id: 'LIST' }
                ]
            }),
            fetchPublicationDetail: builder.query({
                query: ({ publicationId }) => `/detail/${publicationId}`,
                providesTags: (result, error, arg) =>
                    result ? [{ type: 'Publication', id: result.publication._id }] : []
            }),
            deletePublication: builder.mutation({
                query: ({ publicationId }) => {
                    return {
                        url: `/remove/${publicationId}`,
                        method: 'DELETE',
                    }
                },
                invalidatesTags: (result, error, arg) => [
                    { type: 'Publication', id: arg.publicationId },
                    { type: 'Publication', id: 'LIST' },
                    { type: 'Feed', id: 'LIST' },
                    { type: 'UserPublications', id: 'LIST' }
                ]
            }),
            fetchUserPublications: builder.query({
                query: ({ userId, page = 1 }) => `/user/${userId}/${page}`,
                transformResponse: (response) => {
                    if (response.status === 'success') {
                        return {
                            ...publicationsAdapter.setAll(initialState, response.publications.docs),
                            totalPages: response.publications.totalPages,
                            currentPage: response.publications.page
                        };
                    }
                    return initialState;
                },
                providesTags: (result) =>
                    result
                        ? [
                            ...result.ids.map(id => ({ type: 'UserPublications', id })),
                            { type: 'UserPublications', id: 'LIST' }
                        ]
                        : [{ type: 'UserPublications', id: 'LIST' }]
            }),
            uploadPublicationImage: builder.mutation({
                query: ({ publicationId, publication }) => {
                    return {
                        url: `/upload/${publicationId}`,
                        method: 'POST',
                        body: publication
                    }
                },
                invalidatesTags: (result, error, arg) => [
                    { type: 'Publication', id: arg.publicationId },
                    { type: 'Publication', id: 'LIST' },
                    { type: 'Feed', id: 'LIST' },
                    { type: 'UserPublications', id: 'LIST' }
                ]
            }),
            fetchUserFeed: builder.query({
                query: ({ page = 1 }) => `/feed/${page}`,
                transformResponse: (response) => {
                    if (response.status === 'success') {
                        return {
                            ...publicationsAdapter.setAll(initialState, response.publications),
                            totalPages: response.pages,
                            currentPage: response.page
                        };
                    }
                    return initialState;
                },
                providesTags: (result) =>
                    result
                        ? [
                            ...result.ids.map(id => ({ type: 'Feed', id })),
                            { type: 'Feed', id: 'LIST' }
                        ]
                        : [{ type: 'Feed', id: 'LIST' }]
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
    useFetchUserFeedQuery,
    useLazyFetchUserFeedQuery
} = publicationApi;
export { publicationApi }