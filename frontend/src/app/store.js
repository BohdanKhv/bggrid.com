import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import userReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import applyReducer from '../features/apply/applySlice';
import notificationReducer from '../features/notification/notificationSlice';



export const store = configureStore({
    reducer: {
        local: localReducer,
        auth: userReducer,
        game: gameReducer,
        apply: applyReducer,
        notification: notificationReducer,
    },
    devTools: import.meta.env.VITE_REDUX_DEV_TOOLS === 'true' ? true : false,
});