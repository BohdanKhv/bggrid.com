import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import personService from './personService';
import { toast } from 'react-toastify';


const initialState = {
    persons: [],
    personById: null,
    isLoading: false,
    msg: '',
};


export const getPersonById = createAsyncThunk(
    'person/getPersonById',
    async (payload, thunkAPI) => {
        try {
            return await personService.getPersonById(payload);
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


export const getPersons = createAsyncThunk(
    'person/getPersons',
    async (payload, thunkAPI) => {
        try {
            return await personService.getPersons(payload);
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


const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        // Reset state
        resetPerson: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.persons = [];
            state.personById = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPersons.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getPersons.fulfilled, (state, action) => {
            state.isLoading = false;
            state.persons = action.payload.data;
        });
        builder.addCase(getPersons.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getPersonById.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.personById = null;
        });
        builder.addCase(getPersonById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.personById = action.payload.data;
        });
        builder.addCase(getPersonById.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });
    }
});


// Export reducer
export const { resetPerson } = personSlice.actions;
export default personSlice.reducer;