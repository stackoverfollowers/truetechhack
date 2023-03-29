import useFontSize from '@/hooks/use-font-size';
import { useUser } from '@/hooks/use-user';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { MediaType, useGetVideosQuery } from '@/redux/services/stream';
import { useUpdatePreferencesMutation } from '@/redux/services/user';
import { setEpileptic, setUrl } from '@/redux/slices/playerSlice';
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
			style={fs.sm}
			className="flex group cursor-pointer hover:bg-accents-8 bg-accents-9 border border-accents-8 rounded-md items-center justify-between py-3 pl-3 pr-4"
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
	const dispatch = useAppDispatch();
	const epileptic = useAppSelector(state => state.player.epileptic);

	const [page, setPage] = useState(1);
	const [preprocessed, setPreprocessed] = useState(true);
	const [size, setSize] = useState(50);
	const fs = useFontSize();

	const [updatePreferences, { isLoading: isUpdating }] =
		useUpdatePreferencesMutation();
	const { user } = useUser();

	const { data, isLoading } = useGetVideosQuery({
		page,
		size,
		preprocessed,
	});

	if (isLoading) {
		return <div style={fs.sm}>Загрузка...</div>;
	}

	const handleHasEpilepticFrames = () => {
		dispatch(setEpileptic(!epileptic));

		if (user) {
			updatePreferences({ user_id: user?.id, epileptic });
		}
	};

	console.log('epileptic', epileptic);

	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex justify-between">
				<div style={fs.sm} className="uppercase font-semibold mb-2">
					Список доступных видео
				</div>
				<div className="flex items-center gap-x-10">
					<div className="flex items-center">
						<label className="text-sm text-accents-5 mr-3">
							Скрывать эпилептические кадры
						</label>
						<input
							type="checkbox"
							disabled={isUpdating}
							checked={epileptic}
							onChange={handleHasEpilepticFrames}
							className="relative shrink-0 w-[46px] h-6 bg-accents-8 checked:bg-none checked:bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent  focus:outline-none appearance-none before:inline-block before:w-5 before:h-5 before:bg-white  before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200"
						/>
					</div>
					<div className="flex items-center">
						<label className="text-sm text-accents-5 mr-3">Обработанные</label>
						<input
							type="checkbox"
							checked={preprocessed}
							disabled={isLoading}
							onChange={() => setPreprocessed(!preprocessed)}
							className="relative shrink-0 w-[46px] h-6 bg-accents-8 checked:bg-none checked:bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent  focus:outline-none appearance-none before:inline-block before:w-5 before:h-5 before:bg-white  before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200"
						/>
					</div>
				</div>
			</div>

			{data && data?.items?.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
					{data.items.map((video, i) => (
						<VideoCard key={video.id} video={video} />
					))}
				</div>
			) : (
				<div className="flex w-full justify-center items-center text-accents-6 border border-accents-8 p-8 rounded-md">
					Видео не найдено
				</div>
			)}

			<div className="flex justify-end gap-x-2">
				<Button
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
					variant="secondary"
				>
					<FiChevronLeft className="h-5 w-5" />
				</Button>
				<Button
					disabled={Boolean(data) || page === data?.pages}
					onClick={() => setPage(page + 1)}
					variant="secondary"
				>
					<FiChevronRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
};

export default VideoList;
