import { createEntityAdapter } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';

export const publicationsAdapter = createEntityAdapter({
  selectId: (publication) => publication._id,
  sortComparer: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
});

export const publicationSelectors = publicationsAdapter.getSelectors();

export const publicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPublication: builder.mutation({
      query: ({ newPublication }) => ({
        url: 'publication/save',
        method: 'POST',
        body: {
          text: newPublication.text,
          user: newPublication.user,
        },
      }),
      invalidatesTags: [
        { type: 'Publication', id: 'LIST' },
        { type: 'Feed', id: 'LIST' },
        { type: 'Counter', id: 'PUBLICATIONS' },
      ],
    }),
    fetchPublicationDetail: builder.query({
      query: ({ publicationId }) => `publication/detail/${publicationId}`,
      providesTags: (result, error, arg) =>
        result ? [{ type: 'Publication', id: result.publication._id }] : [],
    }),
    deletePublication: builder.mutation({
      query: ({ publicationId }) => ({
        url: `publication/remove/${publicationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Publication', id: arg.publicationId },
        { type: 'Publication', id: 'LIST' },
        { type: 'Feed', id: 'LIST' },
        { type: 'Counter', id: 'PUBLICATIONS' },
      ],
    }),
    fetchUserPublications: builder.query({
      query: ({ userId, page = 1 }) => `publication/user/${userId}/${page}`,
      transformResponse: (response) => {
        if (response.status === 'success') {
          return {
            publications: response.publications.docs,
            totalPages: response.publications.totalPages,
            currentPage: response.publications.page,
          };
        }
        return { publications: [], totalPages: 0, currentPage: 1 };
      },
      providesTags: (result) =>
        result && result.publications
          ? [
            ...result.publications.map((pub) => ({
              type: 'Publication',
              id: pub._id,
            })),
            { type: 'Publication', id: 'LIST' },
          ]
          : [{ type: 'Publication', id: 'LIST' }],
    }),
    uploadPublicationImage: builder.mutation({
      query: ({ publicationId, publication }) => ({
        url: `publication/upload/${publicationId}`,
        method: 'POST',
        body: publication,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Publication', id: arg.publicationId },
        { type: 'Publication', id: 'LIST' },
        { type: 'Feed', id: 'LIST' },
      ],
    }),
    fetchUserFeed: builder.query({
      query: ({ page = 1 }) => `publication/feed/${page}`,
      transformResponse: (response) => {
        if (response.status === 'success') {
          return {
            publications: response.publications,
            totalPages: response.pages,
            currentPage: response.page,
          };
        }
        return { publications: [], totalPages: 0, currentPage: 1 };
      },
      providesTags: (result) =>
        result && result.publications
          ? [
            ...result.publications.map((pub) => ({
              type: 'Feed',
              id: pub._id,
            })),
            { type: 'Feed', id: 'LIST' },
          ]
          : [{ type: 'Feed', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreatePublicationMutation,
  useFetchPublicationDetailQuery,
  useDeletePublicationMutation,
  useFetchUserPublicationsQuery,
  useUploadPublicationImageMutation,
  useFetchUserFeedQuery,
  useLazyFetchUserFeedQuery,
} = publicationApi;