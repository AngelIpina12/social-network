import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const userApi = createApi({
    reducerPath: 'user',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/user',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') || '';
            headers.set('Authorization', token);
            return headers;;
        },
    }),
    endpoints(builder) {
        return {
            createUser: builder.mutation({
                query: ({ userCreated }) => {
                    return {
                        url: `/register`,
                        method: 'POST',
                        body: {
                            name: userCreated.name,
                            surname: userCreated.surname,
                            nick: userCreated.nick,
                            email: userCreated.email,
                            password: userCreated.password,
                        },
                    }
                }
            }),
            loginUser: builder.mutation({
                query: ({ userLogged }) => {
                    return {
                        url: `/login`,
                        method: 'POST',
                        body: {
                            email: userLogged.email,
                            password: userLogged.password,
                        }
                    }
                }
            }),
            fetchUserProfile: builder.query({
                query: ({ userId }) => `/profile/${userId}`
            }),
            fetchListOfUsers: builder.query({
                query: ({ page }) => `/list/${page}`
            }),
            updateUser: builder.mutation({
                query: ({ userUpdated }) => {
                    return {
                        url: `/update`,
                        method: 'PUT',
                        body: {
                            name: userUpdated.name,
                            surname: userUpdated.surname,
                            nick: userUpdated.nick,
                            bio: userUpdated.bio,
                            email: userUpdated.email,
                            password: userUpdated.password,
                        }
                    }
                }
            }),
            uploadUserImage: builder.mutation({
                query: (formData) => {
                    return {
                        url: `/upload`,
                        method: 'POST',
                        body: formData
                    }
                }
            }),
            fetchCounters: builder.query({
                query: ({ userId }) => `/counter/${userId}`
            }),
        }
    }
})

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useFetchUserProfileQuery,
    useLazyFetchUserProfileQuery,
    useFetchListOfUsersQuery,
    useUpdateUserMutation,
    useUploadUserImageMutation,
    useFetchCountersQuery,
} = userApi;
export { userApi }