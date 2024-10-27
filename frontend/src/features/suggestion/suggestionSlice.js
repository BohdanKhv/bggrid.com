import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import suggestionService from './suggestionService';


const initialState = {
    locations: [],
    jobs: [],
    loadingId: ''
};


export const getLocations = createAsyncThunk(
    'suggestion/getLocations',
    async (query, thunkAPI) => {
        try {
            return await suggestionService.getLocations(query);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const getJobs = createAsyncThunk(
    'suggestion/getJobs',
    async (query, thunkAPI) => {
        try {
            return await suggestionService.getJobs(query);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const suggestionSlice = createSlice({
    name: 'suggestion',
    initialState,
    reducers: {
        // Reset state
        resetSuggestions: (state) => {
            state.locations = [];
            state.jobs = [];
            state.loadingId = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLocations.pending, (state) => {
            state.loadingId = 'locations';
        });
        builder.addCase(getLocations.fulfilled, (state, action) => {
            state.loadingId = '';
            state.locations = action.payload.data
        });
        builder.addCase(getLocations.rejected, (state, action) => {
            state.loadingId = '';
        });

        builder.addCase(getJobs.pending, (state) => {
            state.loadingId = 'jobs';
        });
        builder.addCase(getJobs.fulfilled, (state, action) => {
            state.loadingId = '';
            state.jobs = action.payload.data
        });
        builder.addCase(getJobs.rejected, (state, action) => {
            state.loadingId = '';
        });
    }
});


// Export reducer
export const { resetSuggestion } = suggestionSlice.actions;
export default suggestionSlice.reducer;