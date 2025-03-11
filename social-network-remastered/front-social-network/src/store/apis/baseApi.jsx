import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Global } from '../../helpers/Global';

export const baseQuery = fetchBaseQuery({
  baseUrl: Global.url,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', token);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['User', 'Publication', 'Feed', 'Follow', 'Counter'],
});