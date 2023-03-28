import { useTheme } from 'next-themes';
import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import cx from 'clsx';
import {
	setTheme as setColorBlindTheme,
	ThemeState,
} from '@/redux/services/themeSlice';
import { useDispatch } from 'react-redux';

interface Props {
	type?: 'default' | 'prot' | 'deut' | 'trit';
}

const COLORS_BY_BLINDNESS_TYPE = {
	default: ['#951bc6', '#f7151d', '#f7a12d', '#ebe024', '#4ddd47', '#2667c5'],
	deut: ['#4183f1', '#b5921e', '#eec72a', '#feff20', '#d2a63e', '#0037fa'],
	prot: ['#3e69fc', '#786722', '#d1ba2c', '#ffff24', '#b4a231', '#002ac7'],
	trit: ['#cc587b', '#f9105d', '#fc9fb2', '#fdd5dd', '#51dae8', '#17a5b9'],
};

const ColorWheel: React.FC<Props> = ({ type = 'trit' }) => {
	return (
		<div className="flex flex-col w-5 h-5 rounded-full overflow-hidden rotate-90">
			{COLORS_BY_BLINDNESS_TYPE[type].map((color, index) => (
				<div
					key={color}
					className="w-full h-[5px]"
					style={{ backgroundColor: color }}
				/>
			))}
		</div>
	);
};

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	const dispatch = useDispatch();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const themes = [
		{
			label: 'Стандартная',
			value: 'default',
		},
		{
			label: 'Протанопия',
			value: 'prot',
		},
		{
			label: 'Дейтеранопия',
			value: 'deut',
		},
		{
			label: 'Тританопия',
			value: 'trit',
		},
	];

	let selected = themes.find(t => t.value === theme);

	return (
		<Listbox
			value={selected}
			onChange={t => {
				setTheme(t.value);
				dispatch(setColorBlindTheme(t.value as ThemeState['type']));
			}}
		>
			{({ open }) => (
				<>
					<div className="relative z-50">
						<Listbox.Button
							as="div"
							className="relative appearance-none border focus:outline-none border-accents-8 bg-accents-10 text-accents-3 sm:text-sm cursor-default rounded-md py-[5px] px-[5px] "
						>
							<ColorWheel type={selected?.value as any} />
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute -right-3/4 min-w-[164px] p-1 border border-accents-8 bg-accents-10 text-accents-3 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 focus:outline-none text-sm">
								{themes.map(theme => (
									<Listbox.Option
										key={theme.value}
										className={({ active, selected }) =>
											cx(
												'relative flex items-center px-3 py-[5px] cursor-default select-none rounded-md',
												active && 'bg-accents-9 text-accents-2',
												selected
													? 'bg-accents-9 text-accents-2 font-semibold'
													: ' font-normal'
											)
										}
										value={theme}
									>
										{({ selected, active }) => (
											<>
												<ColorWheel type={theme.value as any} />
												<span
													className={cx(
														selected ? 'font-semibold ' : 'font-normal',
														'ml-3 block truncate'
													)}
												>
													{theme.label}
												</span>
											</>
										)}
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

export default ThemeSwitch;
