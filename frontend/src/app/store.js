import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import libraryReducer from '../features/library/librarySlice';
import reviewReducer from '../features/review/reviewSlice';
import playReducer from '../features/play/playSlice';
import userReducer from '../features/user/userSlice';
import friendReducer from '../features/friend/friendSlice';
import notificationReducer from '../features/notification/notificationSlice';



export const store = configureStore({
    reducer: {
        local: localReducer,
        auth: authReducer,
        game: gameReducer,
        library: libraryReducer,
        review: reviewReducer,
        play: playReducer,
        user: userReducer,
        friends: friendReducer,
        notification: notificationReducer,
    },
    devTools: import.meta.env.VITE_REDUX_DEV_TOOLS === 'true' ? true : false,
});