import { configureStore } from "@reduxjs/toolkit";

import usernameSlice from "./slices/usernameSlice";

const store = configureStore({
    reducer: {
        username: usernameSlice
    }
})

export default store;