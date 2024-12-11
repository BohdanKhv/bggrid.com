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
    limit: 20,
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
            // Check if the game is already in the store
            const { gameCard } = thunkAPI.getState().game;
            if (gameCard?._id === payload) {
                return {
                    data: state.game.gameCard
                }
            } else {
                return await gameService.getGameById(payload);
            }
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

export const getGameOverview = createAsyncThunk(
    'game/getGameOverview',
    async (payload, thunkAPI) => {
        try {
            return await gameService.getGameOverview(payload);
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

export const getGamesByPublisherId = createAsyncThunk(
    'game/getGamesByPublisherId',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().game;
            return await gameService.getGamesByPublisherId(`${payload}?page=${page}&limit=${limit}`, token);
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

export const getGamesByPersonId = createAsyncThunk(
    'game/getGamesByPersonId',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            const { page, limit } = thunkAPI.getState().game;
            return await gameService.getGamesByPersonId(`${payload}?page=${page}&limit=${limit}`, token);
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
                state.isError = true;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getGamesByPublisherId.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getGamesByPublisherId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.games.push(...action.payload.data);
            state.pages = action.payload.totalPages;
            state.hasMore = action.payload.currentPage < action.payload.totalPages;
            state.page = action.payload.currentPage + 1;
        });
        builder.addCase(getGamesByPublisherId.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getGamesByPersonId.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getGamesByPersonId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.games.push(...action.payload.data);
            state.pages = action.payload.totalPages;
            state.hasMore = action.payload.currentPage < action.payload.totalPages;
            state.page = action.payload.currentPage + 1;
        });
        builder.addCase(getGamesByPersonId.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.isError = true;
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

        builder.addCase(getGameOverview.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getGameOverview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.gameById = action.payload.data
        });
        builder.addCase(getGameOverview.rejected, (state, action) => {
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