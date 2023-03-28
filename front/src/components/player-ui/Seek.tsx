import { setProgress, setSeeking } from '@/redux/slices/playerSlice';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import React, { forwardRef } from 'react';
import generateRangeStyle from '@/lib/generate-range-style';

const Seek = forwardRef((props, ref) => {
	const dispatch = useDispatch();
	const progress = useSelector((state: RootState) => state.player.progress);

	const seekStyle = generateRangeStyle(progress.played);

	return (
		<input
			id="progress-range-input"
			className="appearance-none h-2 w-full cursor-pointer"
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
				// @ts-ignore
				ref.current?.seekTo(parseFloat(e.target.value));
			}}
			{...props}
		/>
	);
});

Seek.displayName = 'Seek';

export default Seek;
