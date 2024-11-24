import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import collectionService from './collectionService';
import { toast } from 'react-toastify';


const initialState = {
    forYou: {
        games: [],
        isLoading: false,
        isError: false,
    },
    popular: {
        games: [],
        isLoading: false,
        isError: false,
    },
    new: {
        games: [],
        isLoading: false,
        isError: false,
    },
};


export const getCommunityFeed = createAsyncThunk(
    'collection/getCommunityFeed',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await collectionService.getCommunityFeed(token);
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

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        // Reset state
        resetCollection: (state) => {
            state.feed = null;
            state.isLoading = false;
            state.msg = '';
            state.loadingId = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCommunityFeed.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.feed = null;  
        });
        builder.addCase(getCommunityFeed.fulfilled, (state, action) => {
            state.isLoading = false;
            state.feed = action.payload.data;
        });
        builder.addCase(getCommunityFeed.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetCollection } = collectionSlice.actions;
export default collectionSlice.reducer;