import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from './notificationService';
import { toast } from 'react-toastify';

const initialState = {
    notifications: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    msg: "",
    loadingId: ''
};

export const getNotifications = createAsyncThunk(
    "notification/getNotifications",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().user.auth ? thunkAPI.getState().user.auth.token : null;
            return await notificationService.getNotifications(token);
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


export const updateNotificationToRead = createAsyncThunk(
    "notification/updateNotificationToRead",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().user.auth ? thunkAPI.getState().user.auth.token : null;
            return await notificationService.updateNotificationToRead(id, token);
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


export const bulkUpdateNotification = createAsyncThunk(
    "notification/bulkUpdateNotification",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().user.auth ? thunkAPI.getState().user.auth.token : null;
            return await notificationService.bulkUpdateNotification(payload, token);
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


export const updateNotificationToDismissed = createAsyncThunk(
    "notification/updateNotificationToDismissed",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().user.auth ? thunkAPI.getState().user.auth.token : null;
            return await notificationService.updateNotificationToDismissed(id, token);
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
            state.isError = false;
            state.isSuccess = false;
            state.msg = "";
            state.loadingId = '';
        },
    },
    extraReducers: (builder) => {
        // Get notifications
        builder.addCase(getNotifications.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.msg = "";
        })
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.isLoading = false;

            state.notifications = action.payload.data;
        })
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.msg = action.payload;
        })

        // Update to read
        builder.addCase(updateNotificationToRead.pending, (state, action) => {
            state.isError = false;
            state.isSuccess = false;
            state.msg = "";
            state.loadingId = action.meta.arg;
        })
        builder.addCase(updateNotificationToRead.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.notifications = state.notifications.map((notification) =>
                notification._id === action.payload.data._id ? action.payload.data : notification
            );
            state.loadingId = '';
        })
        builder.addCase(updateNotificationToRead.rejected, (state, action) => {
            state.isError = true;
            state.msg = action.payload;
            state.isSuccess = false;
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        })

        // Delete
        builder.addCase(bulkUpdateNotification.pending, (state, action) => {
            state.loadingId = 'bulk'
            state.msg = "";
        })
        builder.addCase(bulkUpdateNotification.fulfilled, (state, action) => {
            if (action.meta.arg.read === true) {
                state.notifications = state.notifications.map((notification) => {
                    if (action.payload.data.includes(notification._id)) {
                        notification.read = true;
                    }
                    return notification;
                });
            } else if (action.meta.arg.dismissed === true) {
                state.notifications = state.notifications.filter((a) => !action.payload.data.includes(a._id));
            }
            state.msg = "dismissed";
            state.loadingId = '';
        })
        builder.addCase(bulkUpdateNotification.rejected, (state, action) => {
            state.msg = action.payload;
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        })

        // Delete
        builder.addCase(updateNotificationToDismissed.pending, (state, action) => {
            state.loadingId = action.meta.arg;
            state.isError = false;
            state.isSuccess = false;
            state.msg = "";
        })
        builder.addCase(updateNotificationToDismissed.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.notifications = state.notifications.filter((a) => a._id !== action.payload.data._id);
            state.msg = "Dismissed";
            state.loadingId = '';
        })
        builder.addCase(updateNotificationToDismissed.rejected, (state, action) => {
            state.msg = action.payload;
            state.isSuccess = false;
            state.isError = true;
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        })
    }
});


export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;