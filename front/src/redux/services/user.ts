import { baseQuery } from '@/lib/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ThemeState } from './themeSlice';

export interface User {
	id: number;
	username: string;
}

interface Preferences {
	user_id: number;
	theme: ThemeState['type'];
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery,
	tagTypes: ['User'],
	endpoints: build => ({
		getPreferences: build.query<Preferences, void>({
			query: () => `/preferences`,
			providesTags: (result, error, id) => [
				{ type: 'User', id: 'preferences' },
			],
		}),
		updatePreferences: build.mutation<User, Partial<Preferences>>({
			query(data) {
				const { user_id, ...body } = data;
				return {
					url: `/preferences/${user_id}`,
					method: 'PUT',
					body,
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'User', id: 'preferences' },
			],
		}),
		getUser: build.query<User, void>({
			query: () => `/me`,
			providesTags: (result, error, id) => [{ type: 'User', id: 'me' }],
		}),
		uploadVideo: build.mutation<any, File>({
			query: data => {
				const formData = new FormData();
				formData.append('file', data);

				return {
					url: `/video`,
					method: 'POST',
					body: formData,
				};
			},
		}),
	}),
});

export const {
	useGetPreferencesQuery,
	useUpdatePreferencesMutation,
	useGetUserQuery,
	useUploadVideoMutation,
} = userApi;
