import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import feedService from './feedService';
import { toast } from 'react-toastify';


const initialState = {
    feed: [],
    home: null,
    isLoading: false,
    isError: false,
    limit: 20,
    page: 1,
    hasMore: true,
};


export const getCommunityFeed = createAsyncThunk(
    'feed/getCommunityFeed',
    async (payload, thunkAPI) => {
        try {
            const { page, limit } = thunkAPI.getState().feed;
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await feedService.getCommunityFeed({ type: payload, page, limit }, token);
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


export const getCommunityFeedForYou = createAsyncThunk(
    'feed/getCommunityFeedForYou',
    async (payload, thunkAPI) => {
        try {
            const { page, limit } = thunkAPI.getState().feed;
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await feedService.getCommunityFeedForYou({ type: payload, page, limit }, token);
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



export const getHomeFeed = createAsyncThunk(
    'feed/getHomeFeed',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await feedService.getHomeFeed(token);
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


export const getGeneralHomeFeed = createAsyncThunk(
    'feed/getGeneralHomeFeed',
    async (_, thunkAPI) => {
        try {
            return await feedService.getGeneralHomeFeed();
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

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        // Reset state
        resetFeed: (state) => {
            state.feed = [];
            state.isLoading = false;
            state.isError = false;
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCommunityFeedForYou.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getCommunityFeedForYou.fulfilled, (state, action) => {
            state.isLoading = false;
            state.feed = [...state.feed, ...action.payload.data];
            state.hasMore = action.payload.hasMore;
        });
        builder.addCase(getCommunityFeedForYou.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getCommunityFeed.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getCommunityFeed.fulfilled, (state, action) => {
            state.isLoading = false;
            state.feed = [...state.feed, ...action.payload.data];
            state.hasMore = action.payload.hasMore;
        });
        builder.addCase(getCommunityFeed.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getHomeFeed.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getHomeFeed.fulfilled, (state, action) => {
            state.isLoading = false;
            state.home = action.payload.data;
        });
        builder.addCase(getHomeFeed.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getGeneralHomeFeed.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getGeneralHomeFeed.fulfilled, (state, action) => {
            state.isLoading = false;
            state.home = action.payload.data;
        });
        builder.addCase(getGeneralHomeFeed.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;