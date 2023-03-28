import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
	setDuration,
	setPlayPause,
	setProgress,
	setStop,
} from '@/redux/slices/playerSlice';
import VolumeControl from './player-ui/VolumeControl';
import DurationDisplay from './player-ui/DurationDisplay';
import Seek from './player-ui/Seek';
import ReactPlayer from 'react-player/lazy';
import PlayPauseButton from './player-ui/PlayPauseButton';
import screenfull from 'screenfull';
import Filters from './player-ui/FiltersButton';
import { FiMaximize2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useTheme } from 'next-themes';
import { COLOR_BLIND_FILTERS } from '@/redux/slices/themeSlice';

interface VideoPlayerProps {
	playerRef: any;
}

const VideoPlayer = ({ playerRef }: VideoPlayerProps) => {
	const dispatch = useDispatch();
	const { seeking, url, ...rest } = useSelector(
		(state: RootState) => state.player
	);
	const { filters } = useSelector((state: RootState) => state.theme);
	const { theme } = useTheme();

	const [showOverlay, setShowOverlay] = useState(false);

	const filterStyle = {
		filter: `brightness(${filters.brightness}%) contrast(${
			filters.contrast
		}%) saturate(${filters.saturation}%) ${
			COLOR_BLIND_FILTERS[theme as keyof typeof COLOR_BLIND_FILTERS]
		}`,
	};

	const handleClickFullscreen = () => {
		if (playerRef?.current) {
			screenfull.request(playerRef.current.wrapper);
		}
	};

	const badFrames = [5, 6, 7, 8, 9, 10, 20, 30]; // show the overlay at these seconds

	useEffect(() => {
		const isBadFrame = badFrames.some(frame => {
			return Math.abs(rest.progress.playedSeconds - frame) <= 1;
		});

		setShowOverlay(isBadFrame);
	}, [rest.progress.playedSeconds]);

	console.log('url', url);

	return (
		<div className="relative group h-full w-full group">
			<ReactPlayer
				ref={playerRef}
				width="100%"
				height="100%"
				onDuration={v => dispatch(setDuration(v))}
				{...rest}
				style={filterStyle}
				onReady={() => console.log('onReady')}
				onStart={() => console.log('onStart')}
				onError={e => console.log('onError', e)}
				onProgress={state => {
					if (!seeking) {
						dispatch(setProgress(state));
					}
				}}
				onEnded={() => dispatch(setStop())}
				url={url}
			/>
			<Transition
				show={showOverlay}
				enter="transition-opacity duration-500"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-500"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="absolute inset-0 bg-black h-full w-full pointer-events-none" />
			</Transition>
			<div
				onClick={() => dispatch(setPlayPause())}
				className="h-[86%] w-full z-10 absolute inset-0"
			/>
			<div className="flex-col absolute bottom-2 items-center h-12 px-3 w-full transition-opacity group-hover:opacity-100 flex opacity-100">
				{/* Progress bar */}
				<div className="flex items-center w-full h-10 bottom-16">
					<Seek ref={playerRef} />
				</div>
				{/* Controls */}
				<div className="flex justify-between w-full">
					{/* Left controls */}
					<div className="flex flex-1 whitespace-nowrap overflow-hidden gap-x-2">
						<PlayPauseButton />
						<VolumeControl />
						<DurationDisplay />
					</div>

					{/* Right controls */}
					<div className="flex items-center">
						<Filters />
						<button
							className="flex items-center justify-center h-12 w-12"
							onClick={handleClickFullscreen}
						>
							<FiMaximize2 className="h-6 w-6 fill-accents-2 text-accents-2 shrink-0 cursor-pointer" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoPlayer;
