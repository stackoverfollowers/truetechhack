import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { streamApi } from './services/stream';
import { authApi } from './services/auth';
import { userApi } from './services/user';
import playerReducer from './services/playerSlice';
import themeReducer from './services/themeSlice';
import authReducer from './services/authSlice';

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
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
