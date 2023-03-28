import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'default' | 'prot' | 'deut' | 'trit';

export const COLOR_BLIND_FILTERS = {
	default: '',
	deut: 'grayscale(70%) brightness(150%) contrast(75%) hue-rotate(-40deg)',
	prot: 'grayscale(80%) brightness(150%) contrast(75%) hue-rotate(-10deg)',
	trit: 'grayscale(80%) brightness(120%) contrast(125%) hue-rotate(150deg)',
};

export interface ThemeState {
	filters: {
		brightness: number;
		contrast: number;
		saturation: number;
	};
	accessibleFs: boolean;
}

const initialState: ThemeState = {
	filters: {
		brightness: 100,
		contrast: 100,
		saturation: 100,
	},
	accessibleFs: false,
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setBrightness: (state, action: PayloadAction<string>) => {
			state.filters.brightness = parseInt(action.payload);
		},
		setContrast: (state, action: PayloadAction<string>) => {
			state.filters.contrast = parseInt(action.payload);
		},
		setSaturation: (state, action: PayloadAction<string>) => {
			state.filters.saturation = parseInt(action.payload);
		},
		setAccessibleFontSize: state => {
			state.accessibleFs = !state.accessibleFs;
		},
	},
});

export const {
	setBrightness,
	setContrast,
	setSaturation,
	setAccessibleFontSize,
} = themeSlice.actions;

export default themeSlice.reducer;
