import { baseQuery } from '@/lib/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

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

interface VideoTimings {
	id: number;
	epileptic_timings: { start_time: number; end_time: number }[];
}

export const streamApi = createApi({
	reducerPath: 'streamApi',
	baseQuery,
	tagTypes: ['Videos', 'Stream'],
	endpoints: build => ({
		getVideos: build.query<ListResponse<Video>, PaginationQuery>({
			query: ({ page = 1, preprocessed = true, size = 50 }) => ({
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
		getVideoTimings: build.query<VideoTimings, number>({
			query: id => `videos/${id}/timings`,
		}),
		uploadVideo: build.mutation<any, File>({
			query: data => {
				const formData = new FormData();
				formData.append('file', data);

				return {
					url: `videos`,
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
	useGetVideosQuery,
	useUploadVideoMutation,
	useGetVideoTimingsQuery,
} = streamApi;
