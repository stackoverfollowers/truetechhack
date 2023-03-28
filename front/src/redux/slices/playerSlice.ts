import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressProps {
	played: number;
	playedSeconds: number;
	loaded: number;
	loadedSeconds: number;
}

interface PlayerState {
	videoId: number | null;
	url: string;
	pip: boolean;
	playing: boolean;
	seeking: boolean;
	controls: boolean;
	light: boolean;
	volume: number;
	muted: boolean;
	progress: ProgressProps;
	loaded: number;
	duration: number;
	playbackRate: number;
	loop: boolean;
}

const initialState: PlayerState = {
	videoId: null,
	url: '',
	pip: false,
	playing: false,
	seeking: false,
	controls: false,
	light: false,
	volume: 0.8,
	muted: false,
	progress: {
		played: 0,
		playedSeconds: 0,
		loaded: 0,
		loadedSeconds: 0,
	},
	loaded: 0,
	duration: 0,
	playbackRate: 1.0,
	loop: false,
};

const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayPause: state => {
			state.playing = !state.playing;
		},
		setPlay: state => {
			state.playing = true;
		},
		setPause: state => {
			state.playing = false;
		},
		setStop: state => {
			state.playing = false;
		},
		setMute: state => {
			if (state.muted && state.volume === 0) {
				state.volume = 0.5;
			}
			state.muted = !state.muted;
		},
		setProgress: (state, action: PayloadAction<ProgressProps>) => {
			state.progress = action.payload;
		},
		resetPlayer: () => initialState,
		setUrl: (state, action: PayloadAction<number>) => {
			state.url = `http://localhost:3001/videos/${action.payload}/stream`;
			state.videoId = action.payload;
		},
		setVolume: (state, action: PayloadAction<string>) => {
			let volume = parseFloat(action.payload);

			state.volume = volume;

			if (volume === 0) {
				state.muted = true;
			} else if (state.muted) {
				state.muted = !state.muted;
			}
		},
		setSeeking: (state, action: PayloadAction<boolean>) => {
			state.seeking = action.payload;
		},
		setPlaybackRate: (state, action: PayloadAction<string>) => {
			state.playbackRate = parseFloat(action.payload);
		},
		setDuration: (state, action: PayloadAction<number>) => {
			state.duration = action.payload;
		},
	},
});

export const {
	setPlayPause,
	setPlay,
	setUrl,
	resetPlayer,
	setPause,
	setStop,
	setMute,
	setVolume,
	setPlaybackRate,
	setDuration,
	setProgress,
	setSeeking,
} = playerSlice.actions;

export default playerSlice.reducer;
