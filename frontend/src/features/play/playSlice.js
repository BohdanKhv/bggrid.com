import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import playService from './playService';
import { toast } from 'react-toastify';


const initialState = {
    plays: [],
    isLoading: false,
    msg: '',
    loadingId: '',
    limit: 50,
    page: 0,
    current: 1,
    pages: 1,
    hasMore: true
};


export const getMyPlays = createAsyncThunk(
    'play/getMyPlays',
    async (payload, thunkAPI) => {
        try {
            const {tags, selectedGame} = payload;
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().play;
            return await playService.getMyPlays(`?page=${page}&limit=${limit}${tags ? `&tags=${tags}` : ""}${selectedGame ? `&selectedGame=${selectedGame}` : ""}`, token);
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

export const getPlaysByGame = createAsyncThunk(
    'play/getPlaysByGame',
    async (payload, thunkAPI) => {
        try {
            return await playService.getPlaysByGame(payload);
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

export const createPlay = createAsyncThunk(
    'play/createPlay',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await playService.createPlay(payload, token);
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

export const deletePlay = createAsyncThunk(
    'play/deletePlay',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await playService.deletePlay(payload, token);
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


const playSlice = createSlice({
    name: 'play',
    initialState,
    reducers: {
        // Reset state
        resetPlay: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.plays = [];
            state.loadingId = '';
            state.page = 0;
            state.hasMore = true;
            state.session = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyPlays.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.plays = [];
        });
        builder.addCase(getMyPlays.fulfilled, (state, action) => {
            state.isLoading = false;
            state.plays = action.payload.data;
            state.pages = action.payload.totalPages;
            state.current = action.payload.page;
            state.hasMore = action.payload.page < action.payload.totalPages;
        });
        builder.addCase(getMyPlays.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getPlaysByGame.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.plays = [];
        });
        builder.addCase(getPlaysByGame.fulfilled, (state, action) => {
            state.isLoading = false;
            state.plays = action.payload.data
        });
        builder.addCase(getPlaysByGame.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(createPlay.pending, (state) => {
            state.loadingId = 'create';
            state.msg = '';
        });
        builder.addCase(createPlay.fulfilled, (state, action) => {
            state.loadingId = '';
            state.msg = 'success';
            toast.success("Play logged successfully!", { toastId: 'toastSuccess', closeButton: true});
        });
        builder.addCase(createPlay.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(deletePlay.pending, (state, action) => {
            state.loadingId = `delete-${action.meta.arg}`;
            state.msg = '';
        });
        builder.addCase(deletePlay.fulfilled, (state, action) => {
            state.loadingId = '';
            state.msg = 'success';
            state.plays = state.plays.filter(play => play._id !== action.payload.data._id);
        });
        builder.addCase(deletePlay.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
    }
});


// Export reducer
export const { resetPlay } = playSlice.actions;
export default playSlice.reducer;