import { baseQuery } from '@/lib/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Theme } from '../slices/themeSlice';

export interface User {
	id: number;
	username: string;
}

export interface UserPreferences {
	user_id: number;
	theme: Theme;
	fs: 'base' | 'lg';
}

interface UserTimingsFeedback {
	startTime: string;
	endTime: string;
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery,
	tagTypes: ['User'],
	endpoints: build => ({
		sendTimingFeedback: build.mutation<void, UserTimingsFeedback>({
			query: data => {
				return {
					url: '/users/feedback',
					method: 'POST',
					body: data,
				};
			},
		}),
		getPreferences: build.query<UserPreferences, void>({
			query: () => `/users/preferences`,
			providesTags: (result, error, id) => [
				{ type: 'User', id: 'preferences' },
			],
		}),
		updatePreferences: build.mutation<
			UserPreferences,
			Partial<UserPreferences>
		>({
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
	useSendTimingFeedbackMutation,
	useGetPreferencesQuery,
	useUpdatePreferencesMutation,
	useGetUserQuery,
} = userApi;
