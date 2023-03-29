import useFontSize from '@/hooks/use-font-size';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import cx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPlaybackRate } from '@/redux/slices/playerSlice';

const PLAYBACK_RATES: { label: string; value: number }[] = [
	{
		label: '0.25',
		value: 0.25,
	},
	{
		label: '0.5',
		value: 0.5,
	},
	{
		label: '0.75',
		value: 0.75,
	},
	{
		label: '1',
		value: 1,
	},
	{
		label: '1.25',
		value: 1.25,
	},
	{
		label: '1.5',
		value: 1.5,
	},
	{
		label: '1.75',
		value: 1.75,
	},
	{
		label: '2',
		value: 2,
	},
];

const PlaybackRateButton = () => {
	const fs = useFontSize();

	const dispatch = useAppDispatch();
	const { playbackRate } = useAppSelector(state => state.player);

	let selectedPlaybackRate = PLAYBACK_RATES.find(t => t.value === playbackRate);

	const handleThemeChange = ({ value }: { value: number }) => {
		dispatch(setPlaybackRate(value));
	};

	return (
		<Listbox value={selectedPlaybackRate} onChange={handleThemeChange}>
			{({ open }) => (
				<>
					<div style={fs.sm} className="relative z-10">
						<Listbox.Button
							as="div"
							style={fs.xs}
							className="relative w-10 text-center appearance-none border focus:outline-none border-accents-8 bg-accents-10 cursor-pointer hover:bg-accents-9 text-accents-3 rounded-md py-[5px] px-[5px]"
						>
							{selectedPlaybackRate?.label}x
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute -translate-y-44 right-0 min-w-[150px] p-1 border border-accents-8 bg-accents-10 text-accents-3 z-10 mt-2 max-h-32 w-fit overflow-auto rounded-md py-1 focus:outline-none">
								{PLAYBACK_RATES.map(rate => (
									<Listbox.Option
										key={rate.value}
										style={fs.sm}
										className={({ active, selected }) =>
											cx(
												'relative flex items-center px-3 py-[5px] cursor-default select-none rounded-md',
												active && 'bg-accents-9 text-accents-2',
												selected
													? 'bg-accents-9 text-accents-2 font-semibold'
													: ' font-normal'
											)
										}
										value={rate}
									>
										<span className="block truncate">{rate.label}</span>
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default PlaybackRateButton;
