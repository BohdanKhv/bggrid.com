import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import salaryService from './salaryService';
import { toast } from 'react-toastify';



const initialState = {
    salaryById: null,
    salaries: [],
    isLoading: false,
    loadingId: '',
    msg: '',
};


export const getSalary = createAsyncThunk(
    'salary/getSalary',
    async (payload, thunkAPI) => {
        try {
            return await salaryService.getSalary(payload);
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


export const compareSalary = createAsyncThunk(
    'salary/compareSalary',
    async (payload, thunkAPI) => {
        try {
            return await salaryService.getSalary(payload);
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



const salarySlice = createSlice({
    name: 'salary',
    initialState,
    reducers: {
        // Reset state
        resetSalary: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.salaryById = null;
            state.loadingId = '';
            state.salaries = [];
        },
        setCompareSalary: (state, action) => {
            state.salaries = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSalary.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.salaryById = null;
        });
        builder.addCase(getSalary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.salaryById = action.payload.data;
        });
        builder.addCase(getSalary.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(compareSalary.pending, (state) => {
            state.loadingId = 'compare';
            state.msg = '';
        });
        builder.addCase(compareSalary.fulfilled, (state, action) => {
            state.loadingId = '';
            state.salaries = [...state.salaries, action.payload.data];
        });
        builder.addCase(compareSalary.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
        });
    }
});


// Export reducer
export const { resetSalary, setCompareSalary } = salarySlice.actions;
export default salarySlice.reducer;