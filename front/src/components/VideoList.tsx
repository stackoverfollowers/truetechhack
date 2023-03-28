import useFontSize from '@/hooks/use-font-size';
import { useAppDispatch } from '@/redux/hooks';
import { MediaType, useGetVideosQuery } from '@/redux/services/stream';
import { setUrl } from '@/redux/slices/playerSlice';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiFilm } from 'react-icons/fi';
import Button from './ui/Button';

const VideoCard = ({ video }: { video: MediaType }) => {
	const dispatch = useAppDispatch();
	const fs = useFontSize();

	const handleVideoSelect = () => {
		dispatch(setUrl(video.id));
	};

	return (
		<div
			key={video.id}
			onClick={handleVideoSelect}
			className={`${fs.sm} flex group cursor-pointer hover:bg-accents-8 bg-accents-9 border border-accents-8 rounded-md items-center justify-between py-3 pl-3 pr-4`}
		>
			<div className="flex w-0 flex-1 items-center">
				<FiFilm
					className="h-5 w-5 flex-shrink-0 text-accents-6"
					aria-hidden="true"
				/>
				<span className="ml-2 w-0 flex-1 truncate">{video.filename}</span>
			</div>
		</div>
	);
};

const VideoList = () => {
	const [page, setPage] = useState(1);
	const [preprocessed, setPreprocessed] = useState(true);
	const [size, setSize] = useState(50);
	const fs = useFontSize();

	const { data, isLoading } = useGetVideosQuery({
		page,
		size,
		preprocessed,
	});

	if (isLoading) {
		return <div className={fs.sm}>Загрузка...</div>;
	}

	if (!data?.items.length) {
		return null;
	}

	return (
		<>
			<div className={`${fs.sm} uppercase font-semibold mb-2`}>
				Список доступных видео
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
				{data.items.map((video, i) => (
					<VideoCard key={video.id} video={video} />
				))}
			</div>

			<div className="flex justify-end gap-x-2">
				<Button
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
					variant="secondary"
				>
					<FiChevronLeft className="h-5 w-5" />
				</Button>
				<Button
					disabled={page === data.pages}
					onClick={() => setPage(page + 1)}
					variant="secondary"
				>
					<FiChevronRight className="h-5 w-5" />
				</Button>
			</div>
		</>
	);
};

export default VideoList;
