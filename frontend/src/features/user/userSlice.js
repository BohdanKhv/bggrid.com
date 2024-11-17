import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userService from './userService';
import { toast } from 'react-toastify';


const initialState = {
    users: [],
    userById: null,
    isLoading: false,
    msg: '',
};


export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async (payload, thunkAPI) => {
        try {
            return await userService.getUserProfile(payload);
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
            state.userById = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(searchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload.data;
        });
        builder.addCase(searchUsers.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getUserProfile.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.userById = null;
        });
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userById = action.payload.data;
        });
        builder.addCase(getUserProfile.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetUser } = userSlice.actions;
export default userSlice.reducer;