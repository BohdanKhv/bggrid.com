import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const theme = localStorage.getItem("theme");
const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

const initialState = {
    theme: theme ? theme : "system",
    searchHistory: searchHistory ? searchHistory : [],
};


export const localSlice = createSlice({
    name: "local",
    initialState,
    reducers: {
        resetLocal: (state) => {
            state.theme = "system";
            state.emailTo = true;
            state.collapseMenu = false;
            state.weather = null;
            localStorage.removeItem("user");
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
        addViewed: (state, action) => {
            const index = state.viewed.findIndex((item) => item === action.payload);
            if (index === -1) {
                state.viewed.push(action.payload);
            } else {
                state.viewed.splice(index, 1);
                state.viewed.push(action.payload);
            }
            localStorage.setItem("viewed", JSON.stringify(state.viewed));
        },
        setSearchHistory: (state, action) => {
            state.searchHistory = action.payload;
            localStorage.setItem("searchHistory", JSON.stringify(action.payload));
        },
    },
});

export const {
    resetLocal, 
    setTheme,
    addViewed,
    setSearchHistory
} = localSlice.actions;
export default localSlice.reducer;