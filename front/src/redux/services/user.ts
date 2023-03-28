import { baseQuery } from '@/lib/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Theme } from '../slices/themeSlice';

export interface User {
	id: number;
	username: string;
}

interface Preferences {
	user_id: number;
	theme: Theme;
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery,
	tagTypes: ['User'],
	endpoints: build => ({
		getPreferences: build.query<Preferences, void>({
			query: () => `/users/preferences`,
			providesTags: (result, error, id) => [
				{ type: 'User', id: 'preferences' },
			],
		}),
		updatePreferences: build.mutation<Preferences, Partial<Preferences>>({
			query(data) {
				return {
					url: `/users/preferences`,
					method: 'PUT',
					body: data,
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'User', id: 'preferences' },
			],
		}),
		getUser: build.query<User, void>({
			query: () => `/users/me`,
			providesTags: (result, error, id) => [{ type: 'User', id: 'me' }],
		}),
	}),
});

export const {
	useGetPreferencesQuery,
	useUpdatePreferencesMutation,
	useGetUserQuery,
} = userApi;
