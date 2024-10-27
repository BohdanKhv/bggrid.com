import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import userReducer from '../features/auth/authSlice';
import listingReducer from '../features/listing/listingSlice';
import applyReducer from '../features/apply/applySlice';
import employerReducer from '../features/employer/employerSlice';
import salaryReducer from '../features/salary/salarySlice';
import suggestionReducer from '../features/suggestion/suggestionSlice';



export const store = configureStore({
    reducer: {
        local: localReducer,
        auth: userReducer,
        listing: listingReducer,
        apply: applyReducer,
        employer: employerReducer,
        salary: salaryReducer,
        suggestion: suggestionReducer,
    },
    devTools: import.meta.env.VITE_REDUX_DEV_TOOLS === 'true' ? true : false,
});