import {
	setDuration,
	setEpilepticTimings,
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
import { EpilepticTimingsResponse } from '@/redux/services/stream';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import InfoButton from './player-ui/InfoButton';
import FeedbackButton from './player-ui/FeedbackButton';
import PlaybackRateButton from './player-ui/PlaybackRateButton';

interface VideoPlayerProps {
	playerRef: any;
}

const VideoPlayer = ({ playerRef }: VideoPlayerProps) => {
	const dispatch = useAppDispatch();
	const { seeking, url, videoId, epilepticTimings, ...rest } = useAppSelector(
		state => state.player
	);
	const { filters } = useAppSelector(state => state.theme);
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

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`${process.env.SERVER_URL}/videos/${videoId}/timings`
			);
			const data: EpilepticTimingsResponse = await response.json();

			dispatch(setEpilepticTimings(data.epileptic_timings));
		};

		if (url) {
			fetchData().catch(console.error);
		}
	}, [url]);

	useEffect(() => {
		if (epilepticTimings) {
			const isBadFrame = epilepticTimings.some(({ start_time, end_time }) => {
				return (
					rest.progress.playedSeconds >= start_time &&
					rest.progress.playedSeconds <= end_time
				);
			});

			setShowOverlay(isBadFrame);
		}
	}, [rest.progress.playedSeconds]);

	return (
		<div className="relative group h-full w-full group">
			<ReactPlayer
				ref={playerRef}
				width="100%"
				height="100%"
				onDuration={v => dispatch(setDuration(v))}
				{...rest}
				style={{ ...filterStyle, minHeight: '600px' }}
				onProgress={state => {
					if (!seeking) dispatch(setProgress(state));
				}}
				onEnded={() => dispatch(setStop())}
				url={url}
			/>

			{/* Overlay */}
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
						{/* Epileptic timings info */}
						<PlaybackRateButton />
						<InfoButton />
						<FeedbackButton />
						<Filters />

						{/* Fullscreen */}
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
