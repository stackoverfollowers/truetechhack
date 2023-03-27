import {
	setBrightness,
	setContrast,
	setSaturation,
	setSharpness,
} from '@/services/playerSlice';
import { RootState } from '@/store';
import { Popover, Transition } from '@headlessui/react';
import {
	FiChevronRight,
	FiFilter,
	FiRefreshCcw,
	FiRotateCcw,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, Fragment, InputHTMLAttributes } from 'react';
import generateRangeStyle from '@/lib/generate-range-style';

interface Option extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon: React.ComponentType<any>;
	value: number;
	min: number;
	max: number;
	setValue: (v: string) => void;
}

const Filters = () => {
	const dispatch = useDispatch();
	const { brightness, contrast, saturation, sharpness } = useSelector(
		(state: RootState) => state.player.filters
	);

	const options: Option[] = [
		{
			label: 'Яркость',
			value: brightness,
			min: 0,
			max: 200,
			defaultValue: 100,
			setValue: (v: string) => dispatch(setBrightness(v)),
			icon: FiChevronRight,
		},
		{
			label: 'Контрастность',
			value: contrast,
			min: 0,
			max: 200,
			defaultValue: 100,
			setValue: (v: string) => dispatch(setContrast(v)),
			icon: FiChevronRight,
		},
		{
			label: 'Насыщенность',
			value: saturation,
			min: 0,
			max: 200,
			defaultValue: 100,
			setValue: (v: string) => dispatch(setSaturation(v)),
			icon: FiChevronRight,
		},
		{
			label: 'Резкость',
			value: sharpness,
			min: 0,
			max: 10,
			defaultValue: 0,
			setValue: (v: string) => dispatch(setSharpness(v)),
			icon: FiChevronRight,
		},
	];

	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button className="flex items-center justify-center h-12 w-12 outline-none">
						<FiFilter
							className="h-6 w-6 fill-foreground text-foreground shrink-0 cursor-pointer"
							aria-hidden="true"
						/>
					</Popover.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute z-10 mt-3 w-[320px] bottom-10 -right-1/2 transform">
							<div className="overflow-hidden rounded-lg ring-1 ring-foreground/10 bg-accents-10 ">
								<div className="relative flex flex-col gap-4 p-2">
									{options.map(({ label, defaultValue, setValue, ...rest }) => {
										const filterStyle = generateRangeStyle(
											(rest.value - rest.min) / (rest.max - rest.min)
										);

										return (
											<div
												key={label}
												className="flex items-center rounded-lg transition duration-150 ease-in-out"
											>
												<div className="flex h-6 w-fit shrink-0 items-center justify-center text-foreground mr-1">
													{defaultValue === rest.value ? (
														<FiChevronRight aria-hidden="true" />
													) : (
														<FiRotateCcw
															onClick={() => setValue(defaultValue as string)}
															aria-hidden="true"
															className="cursor-pointer"
														/>
													)}
												</div>
												<div className="flex justify-between w-full mr-1">
													<label className="text-sm font-medium text-accents-3">
														{label}
													</label>
													<input
														step="any"
														type="range"
														id="filter-range"
														style={filterStyle}
														onChange={e => setValue(e.target.value)}
														className="appearance-none rounded-lg self-center h-1 cursor-pointer"
														{...rest}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

export default Filters;
