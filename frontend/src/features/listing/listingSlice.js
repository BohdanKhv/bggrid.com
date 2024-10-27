import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import listingService from './listingService';
import { toast } from 'react-toastify';


// save checkout listing to local storage
const checkoutListing = JSON.parse(localStorage.getItem('checkoutListing'));

const initialState = {
    session: null,
    listingById: null,
    checkoutListing: checkoutListing || null,
    listings: [],
    isLoading: false,
    msg: '',
    loadingId: '',
    limit: 50,
    page: 0,
    hasMore: true
};


export const getListingsById = createAsyncThunk(
    'listing/getListingsById',
    async (payload, thunkAPI) => {
        try {
            return await listingService.getListingsById(payload);
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


export const geoSearch = createAsyncThunk(
    'listing/geoSearch',
    async (payload, thunkAPI) => {
        try {
            return await listingService.geoSearch(payload);
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


export const getMyListings = createAsyncThunk(
    'listing/getMyListings',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await listingService.getMyListings(token);
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


export const getListings = createAsyncThunk(
    'listing/getListings',
    async (payload, thunkAPI) => {
        try {
            const { page, limit } = thunkAPI.getState().listing;
            let p = `page=${page + 1}&limit=${limit}${payload || ''}`;
            console.log(p)
            return await listingService.getListings(p);
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

export const getListingById = createAsyncThunk(
    "listing/getListingById",
    async (id, thunkAPI) => {
        try {
            return await listingService.getListingById(id);
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

export const getMyListingById = createAsyncThunk(
    "listing/getMyListingById",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await listingService.getMyListingById(id, token);
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

export const getCheckoutSession = createAsyncThunk(
    "listing/getCheckoutSession",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await listingService.getCheckoutSession(id, token);
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


export const createListing = createAsyncThunk(
    "listing/createListing",
    async (payload, thunkAPI) => {
        try {
            return await listingService.createListing(payload);
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


export const createFreeListing = createAsyncThunk(
    "listing/createFreeListing",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await listingService.createFreeListing(payload, token);
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


export const updateListing = createAsyncThunk(
    "listing/updateListing",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user ? thunkAPI.getState().auth.user.token : null;
            return await listingService.updateListing(payload, token);
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




const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        // Reset state
        resetListing: (state) => {
            state.isLoading = false;
            state.msg = '';
            state.listingById = null;
            state.listings = [];
            state.loadingId = '';
            state.page = 0;
            state.hasMore = true;
            state.session = null;
        }, resetLocalCheckout: (state) => {
            state.checkoutListing = null;
            localStorage.removeItem('checkoutListing');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyListings.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.hasMore = true;
        });
        builder.addCase(getMyListings.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listings = action.payload.data
            state.hasMore = false;
        });
        builder.addCase(getMyListings.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(geoSearch.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(geoSearch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listings = action.payload.data;
        });
        builder.addCase(geoSearch.rejected, (state, action) => {
            if (action.error.message !== 'Aborted') {
                state.isLoading = false;
                state.msg = action.payload;
                toast.error(action.payload, { toastId: 'toastError', closeButton: true});
            }
        });

        builder.addCase(getListingsById.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getListingsById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listings = action.payload.data
        });
        builder.addCase(getListingsById.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(getListings.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
        });
        builder.addCase(getListings.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listings = [...state.listings, ...action.payload.data];
            state.hasMore = action.payload.data.length === state.limit;
            state.page += 1;
        });
        builder.addCase(getListings.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(getListingById.pending, (state) => {
            state.isLoading = true;
            state.listingById = null;
            state.msg = '';
        });
        builder.addCase(getListingById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listingById = action.payload.data;
        });
        builder.addCase(getListingById.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(getMyListingById.pending, (state) => {
            state.isLoading = true;
            state.listingById = null;
            state.msg = '';
        });
        builder.addCase(getMyListingById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listingById = action.payload.data;
        });
        builder.addCase(getMyListingById.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(getCheckoutSession.pending, (state, action) => {
            state.isLoading = true;
            state.session = null;
        });
        builder.addCase(getCheckoutSession.fulfilled, (state, action) => {
            state.isLoading = false;
            state.session = action.payload.data;
        });
        builder.addCase(getCheckoutSession.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(createListing.pending, (state, action) => {
            state.isLoading = true;
            state.listingById = null;
            state.msg = '';
            state.checkoutListing = action.meta.arg;
            localStorage.setItem('checkoutListing', JSON.stringify(action.meta.arg));
        });
        builder.addCase(createListing.fulfilled, (state, action) => {
            state.isLoading = false;
            window.location.href = action.payload.data?.session?.url
        });
        builder.addCase(createListing.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(createFreeListing.pending, (state, action) => {
            state.isLoading = true;
            state.msg = '';
            state.listingById = null;
        });
        builder.addCase(createFreeListing.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listingById = action.payload.data;
            state.msg = 'free_listing_created';
        });
        builder.addCase(createFreeListing.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });

        builder.addCase(updateListing.pending, (state, action) => {
            state.loadingId = action.meta.arg._id;
            state.msg = '';
        });
        builder.addCase(updateListing.fulfilled, (state, action) => {
            state.loadingId = "";
            state.listings = state.listings.map((listing) => { 
                if (listing._id === action.payload.data._id) {
                    return action.payload.data;
                }
                return listing;
            });
            if (state.listingById && state.listingById._id === action.payload.data._id) {
                state.listingById = action.payload.data;
            }
        });
        builder.addCase(updateListing.rejected, (state, action) => {
            state.loadingId = "";
            state.msg = action.payload;
            toast.error(action.payload, { toastId: 'toastError', closeButton: true});
        });
    }
});


// Export reducer
export const { resetListing, resetLocalCheckout } = listingSlice.actions;
export default listingSlice.reducer;