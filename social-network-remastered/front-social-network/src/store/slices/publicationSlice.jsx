import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';

const publicationSlice = createSlice({
    name: 'publication',
    initialState: {
        publications: {
            data: [],
        },
    },
    reducers: {
        addPublication: (state, action) => {
        },
        removePublication: (state, action) => {
        },
        setPublications: (state, action) => {
        }
    },
    extraReducers: (builder) => {
        builder
          .addMatcher(
            userApi.endpoints.fetchCounters.matchFulfilled,
            (state, { payload }) => {
              state.counter = {
                following: payload.following,
                followed: payload.followed,
                publications: payload.publications
              };
            }
          )
      }
});

export const {
    addPublication,
    removePublication,
    setPublications
} = publicationSlice.actions;
export const publicationReducer = publicationSlice.reducer;