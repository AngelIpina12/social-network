import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: {
            data: [],
        },
    },
    reducers: {
        addUser: (state, action) => {
        },
        removeUser: (state, action) => {
        },
        setUsers: (state, action) => {
        }
    }
});

export const {
    addUser,
    removeUser,
    setUsers
} = userSlice.actions;
export const userReducer = userSlice.reducer;