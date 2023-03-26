import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
	setDuration,
	setPlayPause,
	setProgress,
	setStop,
} from '@/services/playerSlice';
import VolumeControl from './player-ui/VolumeControl';
import DurationDisplay from './player-ui/DurationDisplay';
import Seek from './player-ui/Seek';
import ReactPlayer from 'react-player/lazy';
import PlayPauseButton from './player-ui/PlayPauseButton';
import screenfull from 'screenfull';
import Filters from './player-ui/FiltersButton';
import { FiMaximize2 } from 'react-icons/fi';

interface VideoPlayerProps {
	playerRef: any;
}

const VideoPlayer = ({ playerRef }: VideoPlayerProps) => {
	const dispatch = useDispatch();
	const player = useSelector((state: RootState) => state.player);

	const style = {
		filter: `brightness(${player.filters.brightness}%) contrast(${player.filters.contrast}%) saturate(${player.filters.saturation}%) blur(${player.filters.sharpness}px)`,
	};

	const handleClickFullscreen = () => {
		if (playerRef?.current) {
			screenfull.request(playerRef.current.wrapper);
		}
	};

	return (
		<div className="relative group h-full w-full group">
			<ReactPlayer
				ref={playerRef}
				width="100%"
				height="100%"
				onDuration={v => dispatch(setDuration(v))}
				{...player}
				style={style}
				onProgress={state => {
					if (!player.seeking) {
						dispatch(setProgress(state));
					}
				}}
				onEnded={() => dispatch(setStop())}
				url="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
			/>
			<div
				onClick={() => dispatch(setPlayPause())}
				className="h-[90%] w-full z-10 absolute inset-0"
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
							<FiMaximize2 className="h-6 w-6 fill-foreground text-foreground shrink-0 cursor-pointer" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoPlayer;
