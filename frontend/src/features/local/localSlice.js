import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const theme = localStorage.getItem("theme");
const bookmarked = JSON.parse(localStorage.getItem("bookmarked"));
const viewed = JSON.parse(localStorage.getItem("viewed"));
const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

const initialState = {
    theme: theme ? theme : "system",
    bookmarked: bookmarked ? bookmarked : [],
    viewed: viewed ? viewed : [],
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
        toggleBookmark: (state, action) => {
            const index = state.bookmarked.findIndex((item) => item === action.payload);
            if (index === -1) {
                state.bookmarked.push(action.payload);
            } else {
                state.bookmarked.splice(index, 1);
            }
            localStorage.setItem("bookmarked", JSON.stringify(state.bookmarked));
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
        removeViewed: (state, action) => {
            const index = state.viewed.findIndex((item) => item === action.payload);
            if (index !== -1) {
                state.viewed.splice(index, 1);
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
    toggleBookmark,
    addViewed,
    removeViewed,
    setSearchHistory
} = localSlice.actions;
export default localSlice.reducer;