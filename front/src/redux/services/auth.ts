import { baseQuery } from '@/lib/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from './user';

export interface AuthResponse {
	user: User;
	token: string;
}

interface AuthPayload {
	username: string;
	password: string;
}

export const authApi = createApi({
	baseQuery,
	endpoints: builder => ({
		signin: builder.mutation<AuthResponse, AuthPayload>({
			query: ({ username, password }) => {
				const data = new URLSearchParams();
				data.append('username', username);
				data.append('password', password);

				return {
					url: '/login',
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				};
			},
		}),
		signup: builder.mutation<AuthResponse, AuthPayload>({
			query: data => {
				return {
					url: '/signup',
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': 'application/json',
					},
				};
			},
		}),
	}),
});

export const { useSigninMutation, useSignupMutation } = authApi;
