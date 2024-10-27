import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';
import { toast } from 'react-toastify';



// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));


const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    msg: '',
    loadingId: '',
};


export const sendLoginEmail = createAsyncThunk(
    'user/sendLoginEmail',
    async (payload, thunkAPI) => {
        try {
            return await authService.sendLoginEmail(payload);
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

export const login = createAsyncThunk(
    "user/login",
    async (payload, thunkAPI) => {
        try {
            return await authService.login(payload);
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

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        await authService.logout();
    }
);

export const updateUser = createAsyncThunk(
    'user/edit',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;;
            return await authService.updateUser(userData, token);
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

export const uploadResume = createAsyncThunk(
    'user/uploadResume',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;;
            return await authService.uploadResume(userData, token);
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

export const getMe = createAsyncThunk(
    'user/getMe',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await authService.getMe(token);
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




const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reset state
        resetUser: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.msg = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendLoginEmail.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.msg = '';
        });
        builder.addCase(sendLoginEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = 'email_sent';
        });
        builder.addCase(sendLoginEmail.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            localStorage.clear();
        });

        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload.data;
            localStorage.setItem('user', JSON.stringify(state.user));
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
            state.user = null;
        });

        builder.addCase(updateUser.pending, (state, action) => {
            state.isError = false;
            state.loadingId = action.meta.arg.avatar ? 'avatar' : action.meta.arg.experience ? 'experience' : 'profile';
            state.msg = '';
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.loadingId = '';
            state.isSuccess = true;
            state.user = action.payload.data;
            localStorage.setItem('user', JSON.stringify(state.user));
            toast.success('Profile updated', { toastId: 'toastSuccess', closeButton: true});
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.loadingId = '';
            state.isError = true;
            state.msg = action.payload;
        });

        builder.addCase(uploadResume.pending, (state, action) => {
            state.isError = false;
            state.loadingId = 'resume';
            state.msg = '';
        });
        builder.addCase(uploadResume.fulfilled, (state, action) => {
            state.loadingId = '';
            state.isSuccess = true;
            state.user = action.payload.data;
    
            localStorage.setItem('user', JSON.stringify(state.user));
            toast.success('Resume uploaded', { toastId: 'toastSuccess', closeButton: true});
        });
        builder.addCase(uploadResume.rejected, (state, action) => {
            state.loadingId = '';
            state.isError = true;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });


        builder.addCase(getMe.pending, (state, action) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
            localStorage.setItem('user', JSON.stringify(state.user));
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            if (action.payload === 'Token expired' || action.payload === 'User not found') {
                localStorage.clear();
                state.user = null;
            }
        });
    }
});


// Export reducer
export const { resetUser } = authSlice.actions;
export default authSlice.reducer;