import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import followService from './followService';
import { getMe } from '../auth/authSlice';
import { toast } from 'react-toastify';


const initialState = {
    follow: [],
    search: [],
    isLoading: false,
    msg: '',
    loadingId: '',
    limit: 20,
    page: 1,
    hasMore: true
};


export const getFollowers = createAsyncThunk(
    'follow/getFollowers',
    async (userId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().game;
            return await followService.getFollowers(`${userId}?page=${page}&limit=${limit}`, token);
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


export const getFollowing = createAsyncThunk(
    'follow/getFollowing',
    async (userId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().game;
            return await followService.getFollowing(`${userId}?page=${page}&limit=${limit}`, token);
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

export const followUser = createAsyncThunk(
    'follow/followUser',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await followService.followUser(payload, token);
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

export const unfollowUser = createAsyncThunk(
    'follow/unfollowUser',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await followService.unfollowUser(payload, token);
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

const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        // Reset state
        resetFollow: (state) => {
            state.follow = [];
            state.isLoading = false;
            state.msg = '';
            state.loadingId = '';
            state.limit = 20;
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getFollowers.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getFollowers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.follow.push(...action.payload.data);
            state.hasMore = action.payload.currentPage < action.payload.totalPages;
            state.page = action.payload.currentPage + 1;
        });
        builder.addCase(getFollowers.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getFollowing.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getFollowing.fulfilled, (state, action) => {
            state.isLoading = false;
            state.follow.push(...action.payload.data);
            state.hasMore = action.payload.currentPage < action.payload.totalPages;
            state.page = action.payload.currentPage + 1;
        });
        builder.addCase(getFollowing.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(followUser.pending, (state, action) => {
            state.loadingId = action.meta.arg;
        });
        builder.addCase(followUser.fulfilled, (state, action) => {
            state.loadingId = '';
            state.follow = state.follow.filter(f => f._id !== action.payload.data._id )
            console.log(state.follow, action.payload.data);
            state.follow.push(action.payload.data);
        });
        builder.addCase(followUser.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(unfollowUser.pending, (state, action) => {
            state.loadingId = action.meta.arg;
        });
        builder.addCase(unfollowUser.fulfilled, (state, action) => {
            state.loadingId = '';
            state.follow = state.follow.filter(f => f._id !== action.payload.data._id )
        });
        builder.addCase(unfollowUser.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
        
    }
});


// Export reducer
export const { resetFollow } = followSlice.actions;
export default followSlice.reducer;