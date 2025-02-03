import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: [],
    reducers: {
        addSong(state, action) {
            state.push(action.payload);
        },
    },
    extraReducers(builder){
        builder.addCase(reset, (state, action) => {
            return [];
        });
    }
});