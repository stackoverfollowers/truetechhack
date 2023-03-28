import { setPlayPause } from '@/redux/services/playerSlice';
import { RootState } from '@/redux/store';
import { FiPause, FiPlay } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

const PlayPauseButton = () => {
	const dispatch = useDispatch();
	const playing = useSelector((state: RootState) => state.player.playing);

	return (
		<>
			{playing ? (
				<button
					className="flex items-center justify-center h-12 w-12"
					onClick={() => dispatch(setPlayPause())}
				>
					<FiPause className="h-6 w-6 fill-accents-2 text-accents-2" />
				</button>
			) : (
				<button
					className="flex items-center justify-center h-12 w-12"
					onClick={() => dispatch(setPlayPause())}
				>
					<FiPlay className="h-6 w-6 fill-accents-2 text-accents-2 shrink-0" />
				</button>
			)}
		</>
	);
};

export default PlayPauseButton;
