import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import reviewService from './reviewService';
import { toast } from 'react-toastify';


const initialState = {
    reviews: [],
    isLoading: false,
    isError: false,
    limit: 50,
    page: 1,
    current: 1,
    pages: 1,
    hasMore: true
};


export const getReviewsByGame = createAsyncThunk(
    'review/getReviewsByGame',
    async (payload, thunkAPI) => {
        try {
            const { page, limit } = thunkAPI.getState().review;
            return await reviewService.getReviewsByGame({ gameId: payload, page, limit });
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


const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        // Reset state
        resetReview: (state) => {
            state.isLoading = false;
            state.reviews = [];
            state.isError = false;
            state.page = 0;
            state.hasMore = true;
            state.current = 1;
            state.pages = 1;
            state.limit = 50;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getReviewsByGame.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.isError = false;
        });
        builder.addCase(getReviewsByGame.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload.data;
            state.pages = action.payload.totalPages;
            state.current = action.payload.page;
        });
        builder.addCase(getReviewsByGame.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;