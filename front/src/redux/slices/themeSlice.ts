import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
	type: 'default' | 'prot' | 'deut' | 'trit';
	filters: {
		brightness: number;
		contrast: number;
		saturation: number;
		sharpness: number;
	};
	// fs: 'xs' | 'sm' | 'base' | 'lg';
}

const initialState: ThemeState = {
	type: 'default',
	filters: {
		brightness: 100,
		contrast: 100,
		saturation: 100,
		sharpness: 0,
	},
	// fs: 'sm'
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<ThemeState['type']>) => {
			state.type = action.payload;
		},
		setBrightness: (state, action: PayloadAction<string>) => {
			state.filters.brightness = parseInt(action.payload);
		},
		setContrast: (state, action: PayloadAction<string>) => {
			state.filters.contrast = parseInt(action.payload);
		},
		setSaturation: (state, action: PayloadAction<string>) => {
			state.filters.saturation = parseInt(action.payload);
		},
		setSharpness: (state, action: PayloadAction<string>) => {
			state.filters.sharpness = parseInt(action.payload);
		},
	},
});

export const {
	setTheme,
	setBrightness,
	setContrast,
	setSaturation,
	setSharpness,
} = themeSlice.actions;

export default themeSlice.reducer;
