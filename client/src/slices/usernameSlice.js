import { createSlice } from "@reduxjs/toolkit";


const usernameSlice = createSlice({
    name: "username",
    initialState: {
        username: false
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { setUsername, getUsername } = usernameSlice.actions;
export default usernameSlice.reducer;