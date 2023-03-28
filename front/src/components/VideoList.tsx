import { useAppDispatch } from '@/redux/hooks';
import { useGetVideosQuery } from '@/redux/services/stream';
import { resetPlayer, setUrl } from '@/redux/slices/playerSlice';
import { useState } from 'react';
import { FiFilm } from 'react-icons/fi';
import Button from './ui/Button';

const VideoList = () => {
	const [page, setPage] = useState(1);
	const [preprocessed, setPreprocessed] = useState(false);
	const [size, setSize] = useState(50);

	const dispatch = useAppDispatch();

	const { data, isLoading, error } = useGetVideosQuery({
		page,
		size,
		preprocessed,
	});

	console.log(data);

	if (isLoading) {
		return <div className="text-sm">Загрузка...</div>;
	}

	if (!data?.items.length) {
		return null;
	}

	return (
		<>
			<div className="text-sm uppercase font-semibold mb-2">Список видео</div>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
				{data.items.map((video, i) => (
					<button
						key={video.id}
						onClick={() => {
							dispatch(resetPlayer());
							dispatch(setUrl(`http://localhost:3001/stream/${video.id}`));
						}}
						className="flex group cursor-pointer hover:bg-accents-8 bg-accents-9 border border-accents-8 rounded-md items-center justify-between py-3 pl-3 pr-4 text-sm"
					>
						<div className="flex w-0 flex-1 items-center">
							<FiFilm
								className="h-5 w-5 flex-shrink-0 text-accents-6"
								aria-hidden="true"
							/>
							<span className="ml-2 w-0 flex-1 truncate">{video.filename}</span>
						</div>
					</button>
				))}
			</div>
			<div className="flex justify-end gap-x-2">
				<Button disabled={page === 1} onClick={() => setPage(page - 1)}>
					Назад
				</Button>
				<Button
					disabled={page === data.pages}
					onClick={() => setPage(page + 1)}
				>
					Вперед
				</Button>
			</div>
		</>
	);
};

export default VideoList;
