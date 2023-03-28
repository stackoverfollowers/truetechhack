import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../services/user';

type AuthState = {
	access_token: string | null;
	refresh_token: string | null;
	user: User | null;
};

type AuthResponse = {
	access_token: string;
	refresh_token: string;
	user: User;
};

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		access_token: null,
		refresh_token: null,
	} as AuthState,
	reducers: {
		setCredentials: (state, { payload }: PayloadAction<AuthResponse>) => {
			const { access_token, refresh_token, user } = payload;

			state.access_token = access_token;
			state.refresh_token = refresh_token;
			state.user = user;
		},
		clearCredentials: state => {
			state.access_token = null;
			state.refresh_token = null;
			state.user = null;
		},
	},
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
