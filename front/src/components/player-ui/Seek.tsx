import { setProgress, setSeeking } from '@/services/playerSlice';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import React, { forwardRef } from 'react';

const Seek = forwardRef((props, ref) => {
	const dispatch = useDispatch();
	const progress = useSelector((state: RootState) => state.player.progress);

	const seekStyle = {
		background: `linear-gradient(to right, #facc15 ${
			progress.played * 100
		}%, #9ca3af ${progress.played * 100}% 100%)`,
	};

	return (
		<input
			id="progress-range-input"
			className="appearance-none h-2 w-full"
			type="range"
			min={0}
			max={0.999999}
			step="any"
			style={seekStyle}
			value={progress.played}
			onChange={e =>
				dispatch(
					setProgress({ ...progress, played: parseFloat(e.target.value) })
				)
			}
			onMouseDown={e => dispatch(setSeeking(true))}
			onMouseUp={e => {
				dispatch(setSeeking(false));
				// @ts-ignore
				console.log('e.target.value', e.target.value);
				// @ts-ignore
				ref.current?.seekTo(parseFloat(e.target.value));
				console.log('ref', ref);
			}}
			{...props}
		/>
	);
});

Seek.displayName = 'Seek';

export default Seek;
