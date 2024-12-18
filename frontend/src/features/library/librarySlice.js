import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import libraryService from './libraryService';
import { createPlay } from '../play/playSlice';
import { getMe } from '../auth/authSlice';
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


export const importBggCollection = createAsyncThunk(
    'library/importBggCollection',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await libraryService.importBggCollection(token);
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

export const addGameToLibrary = createAsyncThunk(
    'library/addGameToLibrary',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await libraryService.addGameToLibrary(payload, token);
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


export const updateGameInLibrary = createAsyncThunk(
    'library/updateGameInLibrary',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await libraryService.updateGameInLibrary(payload, token);
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


export const removeGameFromLibrary = createAsyncThunk(
    'library/removeGameFromLibrary',
    async (gameId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await libraryService.removeGameFromLibrary(gameId, token);
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
        resetLibrary: (state) => {
            state.isLoading = false;
            state.library = [];
            state.loadingId = '';
            state.msg = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.library = action.payload.data.library;
            // Save to local storage
            localStorage.setItem('library', JSON.stringify(state.library));
        });

        builder.addCase(getMyLibrary.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getMyLibrary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.library = action.payload.data;
            // Save to local storage
            localStorage.setItem('library', JSON.stringify(state.library));
        });
        builder.addCase(getMyLibrary.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(importBggCollection.pending, (state) => {
            state.loadingId = 'import';
            state.msg = '';
        });
        builder.addCase(importBggCollection.fulfilled, (state, action) => {
            state.loadingId = '';
            state.library = action.payload.data;
            // Save to local storage
            localStorage.setItem('library', JSON.stringify(state.library));
            state.msg = 'success';
            toast.success('BoardGameGeek collection synced', { toastId: 'toastSuccess', closeButton: true });
        });
        builder.addCase(importBggCollection.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(addGameToLibrary.pending, (state, action) => {
            state.loadingId = action.meta.arg.gameId;
            state.msg = '';
        });
        builder.addCase(addGameToLibrary.fulfilled, (state, action) => {
            state.loadingId = '';
            state.library.push(action.payload.data);
            // Save to local storage
            localStorage.setItem('library', JSON.stringify(state.library));
            state.msg = 'success';
            toast.success('Game added to your library', { toastId: 'toastSuccess', closeButton: true });
        });
        builder.addCase(addGameToLibrary.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(updateGameInLibrary.pending, (state, action) => {
            state.loadingId = action.meta.arg.gameId;
            state.msg = '';
        });
        builder.addCase(updateGameInLibrary.fulfilled, (state, action) => {
            state.loadingId = '';
            const index = state.library.findIndex(game => game._id === action.payload.data._id);
            state.library[index] = action.payload.data;
            localStorage.setItem('library', JSON.stringify(state.library));
            state.msg = 'success';
            toast.success('Game updated', { toastId: 'toastSuccess', closeButton: true });
        });
        builder.addCase(updateGameInLibrary.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(removeGameFromLibrary.pending, (state, action) => {
            state.loadingId = action.meta.arg;
            state.msg = '';
        });
        builder.addCase(removeGameFromLibrary.fulfilled, (state, action) => {
            state.loadingId = '';
            state.library = state.library.filter(item => item?.game?._id !== action.meta.arg);
            localStorage.setItem('library', JSON.stringify(state.library));
            state.msg = 'success';
            toast.success('Game removed from your library', { toastId: 'toastSuccess', closeButton: true });
        });
        builder.addCase(removeGameFromLibrary.rejected, (state, action) => {
            state.loadingId = '';
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(createPlay.fulfilled, (state, action) => {
            state.library = state.library.filter(l => l._id !== action?.payload?.data?.library?._id);
            state.library.push(action.payload.data.library);
            localStorage.setItem('library', JSON.stringify(state.library));
        });
    }
});


// Export reducer
export const { resetLibrary } = librarySlice.actions;
export default librarySlice.reducer;