// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { baseQuery } from '@/lib/base-query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Video {
	id: number;
	created_at: string;
	updated_at: string;
	filename: string;
	author_id: number;
}
interface ListResponse<T> {
	items: T[];
	total: number;
	page: number;
	size: number;
	pages: number;
}

interface PaginationQuery {
	preprocessed: boolean;
	page: number;
	size: number;
}

export const streamApi = createApi({
	reducerPath: 'streamApi',
	baseQuery,
	tagTypes: ['Videos', 'Stream'],
	endpoints: build => ({
		getVideo: build.query<any, void>({
			query: () => `api/video`,
			// providesTags: (result, error, id) => [{ type: 'Video', id }],
		}),
		getStream: build.query<any, void>({
			query: () => `api/stream`,
			// providesTags: (result, error, id) => [{ type: 'Stream', id: 't' }],
		}),
		getVideos: build.query<ListResponse<Video>, PaginationQuery>({
			query: ({ page = 1, preprocessed = false, size = 50 }) => ({
				url: `videos`,
				params: { preprocessed, page, size },
			}),
			providesTags: (result, error, page) =>
				result
					? [
							...result.items.map(({ id }) => ({
								type: 'Videos' as const,
								id,
							})),
							{ type: 'Videos', id: 'VIDEO-LIST' },
					  ]
					: [{ type: 'Videos', id: 'VIDEO-LIST' }],
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
			invalidatesTags: (result, error, id) => [
				{ type: 'Videos', id: 'VIDEO-LIST' },
			],
		}),
	}),
});

export const {
	useGetVideoQuery,
	useGetStreamQuery,
	useGetVideosQuery,
	useUploadVideoMutation,
} = streamApi;
