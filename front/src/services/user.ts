import { baseQuery } from '@/lib/base-qeury';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface User {
	id: number;
	username: string;
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery,
	tagTypes: ['User'],
	endpoints: build => ({
		// getMe: build.query<User, number>({
		// 	query: id => `/api/users/${id}`,
		// 	providesTags: (result, error, id) => [{ type: 'Users', id }],
		// }),
		getUser: build.query<User, void>({ query: () => `/api/users/me` }),
		// updateUser: build.mutation<User, Partial<User>>({
		// 	query(data) {
		// 		const { id, ...body } = data;
		// 		return {
		// 			url: `/api/users/${id}`,
		// 			method: 'PATCH',
		// 			body,
		// 		};
		// 	},
		// 	invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
		// }),
	}),
});

export const {
	// useGetUsersQuery,
	// useAddUserMutation,
	useGetUserQuery,
} = userApi;
