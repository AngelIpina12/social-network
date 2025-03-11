import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createUser: builder.mutation({
        query: ({ userCreated }) => ({
          url: 'user/register',
          method: 'POST',
          body: {
            name: userCreated.name,
            surname: userCreated.surname,
            nick: userCreated.nick,
            email: userCreated.email,
            password: userCreated.password,
          },
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
      }),
      loginUser: builder.mutation({
        query: ({ userLogged }) => ({
          url: 'user/login',
          method: 'POST',
          body: {
            email: userLogged.email,
            password: userLogged.password,
          },
        }),
        invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
      }),
      fetchUserProfile: builder.query({
        query: ({ userId }) => `user/profile/${userId}`,
        providesTags: (result, error, arg) => 
          result ? [{ type: 'User', id: arg.userId }] : [],
      }),
      fetchListOfUsers: builder.query({
        query: ({ page }) => `user/list/${page}`,
        providesTags: (result) => 
          result 
            ? [
                ...result.users.map(user => ({ type: 'User', id: user._id })),
                { type: 'User', id: 'LIST' },
              ]
            : [{ type: 'User', id: 'LIST' }],
      }),
      updateUser: builder.mutation({
        query: ({ userUpdated }) => ({
          url: 'user/update',
          method: 'PUT',
          body: {
            name: userUpdated.name,
            surname: userUpdated.surname,
            nick: userUpdated.nick,
            bio: userUpdated.bio,
            email: userUpdated.email,
            password: userUpdated.password,
          },
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'User', id: result?.user?._id || 'CURRENT' },
        ],
      }),
      uploadUserImage: builder.mutation({
        query: (formData) => ({
          url: 'user/upload',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: (result) => [
          { type: 'User', id: result?.user?._id || 'CURRENT' },
        ],
      }),
      fetchCounters: builder.query({
        query: ({ userId }) => `user/counter/${userId}`,
        providesTags: (result, error, arg) => [
          { type: 'Counter', id: arg.userId },
        ],
      }),
    }),
  });
  
  export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useFetchUserProfileQuery,
    useLazyFetchUserProfileQuery,
    useFetchListOfUsersQuery,
    useUpdateUserMutation,
    useUploadUserImageMutation,
    useFetchCountersQuery,
    useLazyFetchCountersQuery,
  } = userApi;