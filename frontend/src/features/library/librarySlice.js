import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import libraryService from './libraryService';
import { toast } from 'react-toastify';


const library = JSON.parse(localStorage.getItem('library'));

const initialState = {
    library: library ? library : [],
    isLoading: false,
    msg: '',
    loadingId: '',
};


export const getMyLibrary = createAsyncThunk(
    'library/getMyLibrary',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await libraryService.getMyLibrary(token);
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



const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        // Reset state
        resetGame: (state) => {
            state.isLoading = false;
            state.library = [];
            state.loadingId = '';
            state.msg = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyLibrary.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getMyLibrary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.library = action.payload.data;
            // Save to local storage
            localStorage.setItem('library', JSON.stringify(action.payload.data));
        });
        builder.addCase(getMyLibrary.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetGame } = librarySlice.actions;
export default librarySlice.reducer;