import { createSlice } from '@reduxjs/toolkit';

const followSlice = createSlice({
    name: 'follow',
    initialState: [],
    reducers: {
        userFollowing(state, action) {
            state.push(action.payload);
        },
    },
    extraReducers(builder){
        builder.addCase(reset, (state, action) => {
            return [];
        });
    }
});

export const { userFollowing } = followSlice.actions;
export const followReducer = followSlice.reducer;