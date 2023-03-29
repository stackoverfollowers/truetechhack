import { RootState } from '@/redux/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
	baseUrl: `http://${process.env.NEXT_PUBLIC_SERVER_URL}/api/`,
	prepareHeaders: (headers, { getState }) => {
		const { access_token } = (getState() as RootState).auth;
		if (access_token) {
			headers.set('authorization', `Bearer ${access_token}`);
		}
		return headers;
	},
});
