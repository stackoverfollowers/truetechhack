// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const streamApi = createApi({
	reducerPath: 'streamApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/' }),
	// tagTypes: ['Video', 'Stream'],
	endpoints: build => ({
		getVideo: build.query<any, void>({
			query: () => `api/video`,
			// providesTags: (result, error, id) => [{ type: 'Video', id }],
		}),
		getStream: build.query<any, void>({
			query: () => `api/stream`,
			// providesTags: (result, error, id) => [{ type: 'Stream', id: 't' }],
		}),
	}),
});

export const { useGetVideoQuery, useGetStreamQuery } = streamApi;
