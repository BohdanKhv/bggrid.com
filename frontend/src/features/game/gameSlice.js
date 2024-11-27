import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import gameService from './gameService';
import { toast } from 'react-toastify';


const initialState = {
    gameById: null,
    gameCard: null,
    suggestions: [],
    games: [],
    isLoading: false,
    msg: '',
    loadingId: '',
    limit: 10,
    page: 1,
    pages: 1,
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


export const getGameCard = createAsyncThunk(
    'game/getGameCard',
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
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().game;
            return await gameService.getGames(`?page=${page}&limit=${limit}${payload}`, token);
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


export const getSuggestions = createAsyncThunk(
    'game/getSuggestions',
    async (searchValue, thunkAPI) => {
        try {
            return await gameService.getSuggestions(searchValue);
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
            state.gameCard = null;
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
            state.games.push(...action.payload.data);
            state.pages = action.payload.totalPages;
            state.hasMore = action.payload.currentPage < action.payload.totalPages;
            state.page = action.payload.currentPage + 1;
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
            state.gameById = action.payload.data
        });
        builder.addCase(getGameById.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(getGameCard.pending, (state) => {
            state.loadingId = 'addGame';
            state.msg = '';
            state.gameCard = null;
        });
        builder.addCase(getGameCard.fulfilled, (state, action) => {
            state.loadingId = '';
            state.gameCard = action.payload.data
        });
        builder.addCase(getGameCard.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(getSuggestions.pending, (state) => {
            state.loadingId = 'suggestions';
        });
        builder.addCase(getSuggestions.fulfilled, (state, action) => {
            state.loadingId = '';
            state.suggestions = action.payload.data
        });
    }
});


// Export reducer
export const { resetGame } = gameSlice.actions;
export default gameSlice.reducer;