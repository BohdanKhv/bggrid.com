import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import applyService from './applyService';
import { toast } from 'react-toastify';


const myApplies = JSON.parse(localStorage.getItem('myApplies'));
const myAppliesArray = Array.isArray(myApplies) ? myApplies : [];

const initialState = {
    applyById: null,
    listingApplies: [],
    myApplies: myAppliesArray ? myAppliesArray : [],
    isLoading: false,
    msg: '',
    loadingId: '',
    hasMore: true
};


export const getMyApplications = createAsyncThunk(
    "apply/getMyApplications",
    async (select, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await applyService.getMyApplications(select, token);
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


export const getApplicationsByListingId = createAsyncThunk(
    "apply/getApplicationsByListingId",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await applyService.getApplicationsByListingId(payload, token);
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


export const applyToListing = createAsyncThunk(
    "apply/applyToListing",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await applyService.applyToListing(payload, token);
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


export const archiveApplication = createAsyncThunk(
    "apply/archiveApplication",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await applyService.archiveApplication(payload, token);
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




const applySlice = createSlice({
    name: 'apply',
    initialState,
    reducers: {
        // Reset state
        resetApply: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.applyById = null;
            state.listingApplies = [];
            state.myApplies = [];
            state.loadingId = '';
            state.hasMore = true
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyApplications.pending, (state) => {
            state.isLoading = true;
            state.hasMore = true;
            state.msg = '';
        });
        builder.addCase(getMyApplications.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasMore = false;
            state.myApplies = action.payload.data

            localStorage.setItem('myApplies', JSON.stringify(state.myApplies));
        });
        builder.addCase(getMyApplications.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(applyToListing.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(applyToListing.fulfilled, (state, action) => {
            state.isLoading = false;
            state.myApplies.push(action.payload.data);
            state.msg = 'applied';

            localStorage.setItem('myApplies', JSON.stringify(state.myApplies));
        });
        builder.addCase(applyToListing.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(getApplicationsByListingId.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.hasMore = true;
        });
        builder.addCase(getApplicationsByListingId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listingApplies = action.payload.data
            state.hasMore = false;
        });
        builder.addCase(getApplicationsByListingId.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(archiveApplication.pending, (state, action) => {
            state.loadingId = `${action.meta.arg}-archive`;
        });
        builder.addCase(archiveApplication.fulfilled, (state, action) => {
            state.loadingId = '';
            state.listingApplies = state.listingApplies.map(apply => apply._id === action.payload.data._id ? action.payload.data : apply);
            state.msg = 'archived_application';
        });
        builder.addCase(archiveApplication.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
    }
});


// Export reducer
export const { resetApply } = applySlice.actions;
export default applySlice.reducer;