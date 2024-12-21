import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from './notificationService';
import { toast } from 'react-toastify';

const initialState = {
    notifications: [],
    isLoading: false,
    page: 1,
    limit: 20,
};

export const getMyNotification = createAsyncThunk(
    "notification/getMyNotification",
    async (_, thunkAPI) => {
        try {
            const { page, limit } = thunkAPI.getState().notification;
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await notificationService.getMyNotification({ page, limit }, token);
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


export const readNotifications = createAsyncThunk(
    "notification/readNotifications",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await notificationService.readNotifications(token);
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


export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        resetNotifications: (state) => {
            state.notifications = null;
            state.isLoading = false;
            state.page = 1;
            state.limit = 20;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMyNotification.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getMyNotification.fulfilled, (state, action) => {
            state.isLoading = false;
            state.notifications.push(...action.payload.data);
        })
        builder.addCase(getMyNotification.rejected, (state, action) => {
            state.isLoading = false;
        })

        builder.addCase(readNotifications.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.notifications = state.notifications.map((notification) => {
                notification.read = true;
                return notification;
            });
        })
    }
});


export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;