import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userService from './userService';
import { followUser, unfollowUser } from '../follow/followSlice';
import { toast } from 'react-toastify';


const initialState = {
    users: [],
    userById: null,
    isLoading: false,
    isError: false,
    msg: '',
};


export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await userService.getUserProfile(payload, token);
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


export const searchUsers = createAsyncThunk(
    'user/searchUsers',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await userService.searchUsers(payload, token);
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


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reset state
        resetUser: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.users = [];
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchUsers.pending, (state) => {
            state.loadingId = 'search';
            state.msg = '';
        });
        builder.addCase(searchUsers.fulfilled, (state, action) => {
            state.loadingId = "";
            state.users = action.payload.data;
        });
        builder.addCase(searchUsers.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.loadingId = "";
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getUserProfile.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.userById = null;
            state.isError = false;
        });
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userById = action.payload.data;
        });
        builder.addCase(getUserProfile.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                state.isError = true;
                // toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(followUser.fulfilled, (state, action) => {
            state.users = state.users.map(user => {
                if (user._id === action.payload.data._id) {
                    user.isFollowing = true;
                    user.followers += 1;
                }
                return user;
            });
            if (state.userById && state.userById._id === action.payload.data._id) {
                state.userById.isFollowing = true;
                state.userById.followers += 1;
            }
        });

        builder.addCase(unfollowUser.fulfilled, (state, action) => {
            state.users = state.users.map(user => {
                if (user._id === action.payload.data._id) {
                    user.isFollowing = false;
                    user.followers -= 1;
                }
                return user;
            });
            if (state.userById && state.userById._id === action.payload.data._id) {
                state.userById.isFollowing = false;
                state.userById.followers -= 1;
            }
        });
    }
});


// Export reducer
export const { resetUser } = userSlice.actions;
export default userSlice.reducer;