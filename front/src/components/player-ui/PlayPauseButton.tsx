import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPlayPause } from '@/redux/slices/playerSlice';
import { FiPause, FiPlay } from 'react-icons/fi';

const PlayPauseButton = () => {
	const dispatch = useAppDispatch();
	const playing = useAppSelector(state => state.player.playing);

	return (
		<>
			{playing ? (
				<button
					className="flex items-center justify-center h-12 w-6"
					onClick={() => dispatch(setPlayPause())}
				>
					<FiPause className="h-6 w-6 fill-accents-2 text-accents-2" />
				</button>
			) : (
				<button
					className="flex items-center justify-center h-12 w-6"
					onClick={() => dispatch(setPlayPause())}
				>
					<FiPlay className="h-6 w-6 fill-accents-2 text-accents-2 shrink-0" />
				</button>
			)}
		</>
	);
};

export default PlayPauseButton;
