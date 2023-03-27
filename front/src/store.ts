import { configureStore } from '@reduxjs/toolkit';
import { streamApi } from './services/stream';
import playerReducer from './services/playerSlice';
import themeReducer from './services/themeSlice';

export const store = configureStore({
	reducer: {
		[streamApi.reducerPath]: streamApi.reducer,
		player: playerReducer,
		theme: themeReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(streamApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
