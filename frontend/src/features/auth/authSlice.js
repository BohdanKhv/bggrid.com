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
    'auth/sendLoginEmail',
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

export const register = createAsyncThunk(
    "auth/register",
    async (payload, thunkAPI) => {
        try {
            return await authService.register(payload);
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
    "auth/login",
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
    'auth/logout',
    async () => {
        await authService.logout();
    }
);

export const updateUser = createAsyncThunk(
    'auth/edit',
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

export const getMe = createAsyncThunk(
    'auth/getMe',
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


// Sent reset password email
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data, thunkAPI) => {
        try {
            return await authService.forgotPassword(data);
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


// Create new password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, thunkAPI) => {
        try {
            return await authService.resetPassword(data);
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
    name: 'auth',
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

        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload.data;
            localStorage.setItem('user', JSON.stringify(state.user));
        });
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
            state.user = null;
        });

        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.msg = '';
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

        builder.addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.msg = '';
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.msg = action.payload.msg;
            toast.success("Email sent!", { toastId: 'toastSuccess', closeButton: true});
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
        });

        builder.addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.msg = '';
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload.msg;
            toast.success("Password updated!", { toastId: 'toastSuccess', closeButton: true});
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.msg = action.payload;
        });
    }
});


// Export reducer
export const { resetUser } = authSlice.actions;
export default authSlice.reducer;