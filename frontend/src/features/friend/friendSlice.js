import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import friendService from './friendService';
import { toast } from 'react-toastify';


const initialState = {
    friends: [],
    isLoading: false,
    msg: '',
    loadingId: '',
};


export const getMyFriends = createAsyncThunk(
    'friend/getMyFriends',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await friendService.getMyFriends(token);
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


export const sendFriendRequest = createAsyncThunk(
    'friend/sendFriendRequest',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await friendService.sendFriendRequest(payload, token);
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


export const acceptFriendRequest = createAsyncThunk(
    'friend/acceptFriendRequest',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await friendService.acceptFriendRequest(payload, token);
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


export const declineFriendRequest = createAsyncThunk(
    'friend/declineFriendRequest',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await friendService.declineFriendRequest(payload, token);
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


export const removeFriend = createAsyncThunk(
    'friend/removeFriend',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await friendService.removeFriend(payload, token);
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


const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        // Reset state
        resetFriend: (state) => {
            state.friends = [];
            state.isLoading = false;
            state.msg = '';
            state.loadingId = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyFriends.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getMyFriends.fulfilled, (state, action) => {
            state.isLoading = false;
            state.friends = action.payload.data;
        });
        builder.addCase(getMyFriends.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(sendFriendRequest.pending, (state, action) => {
            state.loadingId = `send-${action.meta.arg}`;
            state.msg = '';
        });
        builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
            state.loadingId = '';
            state.friends.push(action.payload.data);
        });
        builder.addCase(sendFriendRequest.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.loadingId = '';
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(acceptFriendRequest.pending, (state, action) => {
            state.loadingId = `resolve-${action.meta.arg}`;
            state.msg = '';
        });
        builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
            state.loadingId = '';
            state.friends.push(action.payload.data);
        });
        builder.addCase(acceptFriendRequest.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.loadingId = '';
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(declineFriendRequest.pending, (state, action) => {
            state.loadingId = `resolve-${action.meta.arg}`;
            state.msg = '';
        });
        builder.addCase(declineFriendRequest.fulfilled, (state, action) => {
            state.loadingId = '';
            state.friends = state.friends.filter(friend => friend._id !== action.payload.data._id);
        });

        builder.addCase(declineFriendRequest.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.loadingId = '';
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(removeFriend.pending, (state, action) => {
            state.loadingId = `delete-${action.meta.arg}`;
            state.msg = '';
        });
        builder.addCase(removeFriend.fulfilled, (state, action) => {
            state.loadingId = '';
            state.friends = state.friends.filter(friend => friend._id !== action.payload.data._id);
        });
        builder.addCase(removeFriend.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
    }
});


// Export reducer
export const { resetFriend } = friendSlice.actions;
export default friendSlice.reducer;