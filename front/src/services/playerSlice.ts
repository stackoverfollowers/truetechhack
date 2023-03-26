import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressProps {
	played: number;
	playedSeconds: number;
	loaded: number;
	loadedSeconds: number;
}

interface PlayerState {
	url: string | null;
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
	brightness: number;
	contrast: number;
	saturation: number;
	sharpness: number;
}

const initialState: PlayerState = {
	url: null,
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
	brightness: 100,
	contrast: 100,
	saturation: 100,
	sharpness: 100,
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
		setBrightness: (state, action: PayloadAction<string>) => {
			state.brightness = parseInt(action.payload);
		},
		setContrast: (state, action: PayloadAction<string>) => {
			state.contrast = parseInt(action.payload);
		},
		setSaturation: (state, action: PayloadAction<string>) => {
			state.saturation = parseInt(action.payload);
		},
		setSharpness: (state, action: PayloadAction<string>) => {
			state.sharpness = parseInt(action.payload);
		},
	},
});

export const {
	setPlayPause,
	setPlay,
	setPause,
	setStop,
	setMute,
	setVolume,
	setPlaybackRate,
	setDuration,
	setBrightness,
	setContrast,
	setSaturation,
	setSharpness,
	setProgress,
	setSeeking,
} = playerSlice.actions;

export default playerSlice.reducer;
