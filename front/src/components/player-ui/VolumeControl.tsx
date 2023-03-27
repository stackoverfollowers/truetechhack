import generateRangeStyle from '@/lib/generate-range-style';
import { setMute, setVolume } from '@/services/playerSlice';
import { RootState } from '@/store';
import { FiVolume1, FiVolumeX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

const VolumeControl = () => {
	const dispatch = useDispatch();
	const { volume, muted } = useSelector((state: RootState) => state.player);

	const volumeStyle = generateRangeStyle(volume);

	return (
		<div className="flex group items-center">
			<button onClick={() => dispatch(setMute())}>
				{volume === 0 || muted ? (
					<FiVolumeX className="h-6 w-6 fill-accents-2 text-accents-2 shrink-0" />
				) : (
					<FiVolume1 className="h-6 w-6 fill-accents-2 text-accents-2 shrink-0" />
				)}
			</button>
			<input
				id="volume-range-input"
				className="rounded-lg appearance-none h-1 w-16 ml-1"
				type="range"
				min={0}
				max={1}
				step={0.1}
				value={volume}
				onChange={e => dispatch(setVolume(e.target.value))}
				style={volumeStyle}
			/>
		</div>
	);
};

export default VolumeControl;
