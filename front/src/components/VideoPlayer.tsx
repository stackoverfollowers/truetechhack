import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
	setDuration,
	setPlayPause,
	setVolume,
	setMute,
	setProgress,
} from '@/services/playerSlice';
import { FiMaximize2, FiPause, FiPlay } from 'react-icons/fi';
import VolumeControl from './player-ui/VolumeControl';
import DurationDisplay from './player-ui/DurationDisplay';
import Seek from './player-ui/Seek';
import ReactPlayer from 'react-player/lazy';
import screenfull from 'screenfull';

interface VideoPlayerProps {
	playerRef: any;
}

const VideoPlayer = ({ playerRef }: VideoPlayerProps) => {
	const dispatch = useDispatch();
	const player = useSelector((state: RootState) => state.player);

	const style = {
		filter: `brightness(${player.brightness}%) contrast(${player.contrast}%) saturate(${player.saturation}%) brightness(${player.sharpness}%)`,
	};

	const handleClickFullscreen = () => {
		if (playerRef.current) {
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
				url="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
			/>
			<div
				onClick={() => dispatch(setPlayPause())}
				className="h-[90%] w-full z-10 absolute inset-0"
			/>
			<div className="flex-col absolute bottom-2 items-center h-12 px-3 w-full transition-opacity group-hover:opacity-100 flex opacity-1000">
				{/* Progress bar */}
				<div className="flex items-center w-full h-10 bottom-16">
					<Seek ref={playerRef} />
				</div>
				{/* Controls */}
				<div className="flex justify-between w-full px-2">
					{/* Left controls */}
					<div className="flex flex-1 whitespace-nowrap overflow-hidden gap-x-4">
						{player.playing ? (
							<button
								className="flex items-center justify-center h-12 w-12"
								onClick={() => dispatch(setPlayPause())}
							>
								<FiPause className="h-6 w-6 fill-white text-white" />
							</button>
						) : (
							<button
								className="flex items-center justify-center h-12 w-12"
								onClick={() => dispatch(setPlayPause())}
							>
								<FiPlay className="h-6 w-6 fill-white text-white shrink-0" />
							</button>
						)}

						<VolumeControl
							value={player.volume}
							onChange={e => dispatch(setVolume(e.target.value))}
							onMute={() => dispatch(setMute())}
							muted={player.muted}
						/>

						<DurationDisplay
							duration={player.duration}
							played={player.duration * player.progress.played}
						/>
					</div>

					{/* Right controls */}
					<div className="flex items-center">
						<FiMaximize2
							className="h-6 w-6 fill-white text-white shrink-0"
							onClick={handleClickFullscreen}
						/>
					</div>
				</div>
			</div>

			{/* <div className="text-white hidden">
				<div>
					<label htmlFor="brightness">Brightness:</label>
					<input
						type="range"
						id="brightness"
						min="0"
						max="200"
						value={player.brightness}
						onChange={e => dispatch(setBrightness(e.target.value))}
					/>
				</div>
				<div>
					<label htmlFor="contrast">Contrast:</label>
					<input
						type="range"
						id="contrast"
						min="0"
						max="200"
						value={player.contrast}
						onChange={e => dispatch(setContrast(e.target.value))}
					/>
				</div>
				<div>
					<label htmlFor="saturation">Saturation:</label>
					<input
						type="range"
						id="saturation"
						min="0"
						max="200"
						value={player.saturation}
						onChange={e => dispatch(setSaturation(e.target.value))}
					/>
				</div>
				<div>
					<label htmlFor="sharpness">Sharpness:</label>
					<input
						type="range"
						id="sharpness"
						min="-100"
						max="100"
						value={player.sharpness}
						onChange={e => dispatch(setSharpness(e.target.value))}
					/>
				</div>
			</div> */}
		</div>
	);
};

export default VideoPlayer;
