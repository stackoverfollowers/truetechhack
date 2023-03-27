import { baseQuery } from '@/lib/base-qeury';
import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from './user';

export interface AuthResponse {
	user: User;
	token: string;
}

interface LoginPayload {
	username: string;
	password: string;
}

export const authApi = createApi({
	baseQuery,
	endpoints: builder => ({
		login: builder.mutation<AuthResponse, LoginPayload>({
			query: ({ username, password }) => {
				const data = new URLSearchParams();
				data.append('username', username);
				data.append('password', password);

				return {
					url: '/api/login',
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				};
			},
		}),
	}),
});

export const { useLoginMutation } = authApi;
