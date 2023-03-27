import { RootState } from '@/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
	baseUrl: process.env.SERVER_URL,
	prepareHeaders: (headers, { getState }) => {
		// get token from local storage
		// const token = localStorage.getItem('token');

		const { access_token } = (getState() as RootState).auth;

		if (access_token) {
			headers.set('authorization', `Bearer ${access_token}`);
		}

		// headers.set('ngrok-skip-browser-warning', '6024');
		return headers;
	},
});
