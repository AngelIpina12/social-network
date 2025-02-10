import { createSlice } from '@reduxjs/toolkit';

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
    }
});

export const {
    addPublication,
    removePublication,
    setPublications
} = publicationSlice.actions;
export const publicationReducer = publicationSlice.reducer;