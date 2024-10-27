import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import gameService from './gameService';
import { toast } from 'react-toastify';


const initialState = {
    gameById: null,
    games: [],
    isLoading: false,
    msg: '',
    loadingId: '',
    limit: 50,
    page: 0,
    hasMore: true
};


export const getGameById = createAsyncThunk(
    'game/getGameById',
    async (payload, thunkAPI) => {
        try {
            return await gameService.getGameById(payload);
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


export const getGames = createAsyncThunk(
    'game/getGames',
    async (payload, thunkAPI) => {
        try {
            return await gameService.getGames(payload);
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



const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // Reset state
        resetGame: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.gameById = null;
            state.games = [];
            state.loadingId = '';
            state.page = 0;
            state.hasMore = true;
            state.session = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGames.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getGames.fulfilled, (state, action) => {
            state.isLoading = false;
            state.games = action.payload.data;
        });
        builder.addCase(getGames.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getGameById.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getGameById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.games = action.payload.data
        });
        builder.addCase(getGameById.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
    }
});


// Export reducer
export const { resetGame } = gameSlice.actions;
export default gameSlice.reducer;