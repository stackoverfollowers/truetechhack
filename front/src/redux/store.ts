import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { streamApi } from './services/stream';
import { authApi } from './services/auth';
import { userApi } from './services/user';
import playerReducer from './slices/playerSlice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';

import storage from 'redux-persist/lib/storage';
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';

const reducers = combineReducers({
	[streamApi.reducerPath]: streamApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[userApi.reducerPath]: userApi.reducer,
	player: playerReducer,
	theme: themeReducer,
	auth: authReducer,
});

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		})
			.concat(streamApi.middleware)
			.concat(authApi.middleware)
			.concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
