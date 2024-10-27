import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import employerService from './employerService';
import { toast } from 'react-toastify';



const initialState = {
    employerById: null,
    employers: [],
    isLoading: false,
    msg: '',
    loadingId: '',
};


export const getEmployerProfile = createAsyncThunk(
    'employer/getEmployerProfile',
    async (id, thunkAPI) => {
        try {
            return await employerService.getEmployerProfile(id);
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


export const getEmployers = createAsyncThunk(
    'employer/getEmployers',
    async (_, thunkAPI) => {
        try {
            return await employerService.getEmployers();
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




const employerSlice = createSlice({
    name: 'employer',
    initialState,
    reducers: {
        // Reset state
        resetEmployer: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.loadingId = '';
            state.employerById = null;
            state.employers = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getEmployerProfile.pending, (state) => {
            state.isLoading = true;
            state.employerById = null;
            state.msg = '';
        });
        builder.addCase(getEmployerProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.employerById = action.payload.data;
        });
        builder.addCase(getEmployerProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(getEmployers.pending, (state) => {
            state.isLoading = true;
            state.employers = [];
            state.msg = '';
        });
        builder.addCase(getEmployers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.employers = action.payload.data;
        });
        builder.addCase(getEmployers.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });
    }
});


// Export reducer
export const { resetEmployer } = employerSlice.actions;
export default employerSlice.reducer;