import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import designerService from './designerService';
import { toast } from 'react-toastify';


const initialState = {
    designers: [],
    designerById: null,
    isLoading: false,
    msg: '',
};


export const getDesignerById = createAsyncThunk(
    'designer/getDesignerById',
    async (payload, thunkAPI) => {
        try {
            return await designerService.getDesignerById(payload);
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


export const getDesigners = createAsyncThunk(
    'designer/getDesigners',
    async (payload, thunkAPI) => {
        try {
            return await designerService.getDesigners(payload);
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


const designerSlice = createSlice({
    name: 'designer',
    initialState,
    reducers: {
        // Reset state
        resetDesigner: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.designers = [];
            state.designerById = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getDesigners.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getDesigners.fulfilled, (state, action) => {
            state.isLoading = false;
            state.designers = action.payload.data;
        });
        builder.addCase(getDesigners.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getDesignerById.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.designerById = null;
        });
        builder.addCase(getDesignerById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.designerById = action.payload.data;
        });
        builder.addCase(getDesignerById.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetDesigner } = designerSlice.actions;
export default designerSlice.reducer;