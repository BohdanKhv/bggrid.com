import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import publisherService from './publisherService';
import { toast } from 'react-toastify';


const initialState = {
    publishers: [],
    publisherById: null,
    isLoading: false,
    msg: '',
};


export const getPublisherById = createAsyncThunk(
    'publisher/getPublisherById',
    async (payload, thunkAPI) => {
        try {
            return await publisherService.getPublisherById(payload);
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


export const getPublishers = createAsyncThunk(
    'publisher/getPublishers',
    async (payload, thunkAPI) => {
        try {
            return await publisherService.getPublishers(payload);
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


const publisherSlice = createSlice({
    name: 'publisher',
    initialState,
    reducers: {
        // Reset state
        resetPublisher: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.publishers = [];
            state.publisherById = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPublishers.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getPublishers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.publishers = action.payload.data;
        });
        builder.addCase(getPublishers.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getPublisherById.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.publisherById = null;
        });
        builder.addCase(getPublisherById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.publisherById = action.payload.data;
        });
        builder.addCase(getPublisherById.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetPublisher } = publisherSlice.actions;
export default publisherSlice.reducer;