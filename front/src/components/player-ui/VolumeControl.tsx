import { Dispatch } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { FiVolume1, FiVolumeX } from 'react-icons/fi';

interface VolumeControlProps {
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	muted: boolean;
	onMute: () => void;
}

const VolumeControl = (props: VolumeControlProps) => {
	const { muted, onMute, ...rest } = props;

	const volumeStyle = {
		background: `linear-gradient(to right, #ffffff ${
			props.value * 100
		}%, #9ca3af ${props.value * 100}% 100%)`,
	};

	return (
		<div className="flex group">
			<div className="flex items-center justify-center h-12 min-w-[48px] max-w-full cursor-pointer">
				<button onClick={onMute}>
					{props.value === 0 || muted ? (
						<FiVolumeX className="h-6 w-6 fill-white text-white shrink-0" />
					) : (
						<FiVolume1 className="h-6 w-6 fill-white text-white shrink-0" />
					)}
				</button>
			</div>
			<div className="flex items-center">
				<input
					id="volume-range-input"
					className="rounded-lg appearance-none h-1 w-16"
					type="range"
					min={0}
					max={1}
					step={0.1}
					{...rest}
					style={volumeStyle}
				/>
			</div>
		</div>
	);
};

export default VolumeControl;
