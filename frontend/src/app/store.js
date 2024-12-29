import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import publisherReducer from '../features/publisher/publisherSlice';
import personReducer from '../features/person/personSlice';
import libraryReducer from '../features/library/librarySlice';
import reviewReducer from '../features/review/reviewSlice';
import playReducer from '../features/play/playSlice';
import userReducer from '../features/user/userSlice';
import followReducer from '../features/follow/followSlice';
import notificationReducer from '../features/notification/notificationSlice';
import feedReducer from '../features/feed/feedSlice';



export const store = configureStore({
    reducer: {
        local: localReducer, // local storage
        auth: authReducer, // login, register, logout
        game: gameReducer, // game page, game search, game card
        publisher: publisherReducer, // publisher page, publisher search
        person: personReducer, // publisher page, publisher search
        library: libraryReducer, // library page, my library
        review: reviewReducer, // game page reviews
        play: playReducer, // game page play history, my plays
        user: userReducer, // user profiles, user search
        follow: followReducer, // community, follow list
        notification: notificationReducer, // notification, follow request
        feed: feedReducer, // community page feed
    },
    devTools: import.meta.env.VITE_REDUX_DEV_TOOLS === 'true' ? true : false,
});