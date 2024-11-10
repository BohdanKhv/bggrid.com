import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import libraryReducer from '../features/library/librarySlice';
import notificationReducer from '../features/notification/notificationSlice';



export const store = configureStore({
    reducer: {
        local: localReducer,
        auth: authReducer,
        game: gameReducer,
        library: libraryReducer,
        notification: notificationReducer,
    },
    devTools: import.meta.env.VITE_REDUX_DEV_TOOLS === 'true' ? true : false,
});