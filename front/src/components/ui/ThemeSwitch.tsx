import { useTheme } from 'next-themes';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import cx from 'clsx';
import { Theme } from '@/redux/slices/themeSlice';
import { useUpdatePreferencesMutation } from '@/redux/services/user';
import { useUser } from '@/hooks/use-user';
import useFontSize from '@/hooks/use-font-size';

const COLORS_BY_BLINDNESS_TYPE = {
	default: ['#951bc6', '#f7151d', '#f7a12d', '#ebe024', '#4ddd47', '#2667c5'],
	deut: ['#4183f1', '#b5921e', '#eec72a', '#feff20', '#d2a63e', '#0037fa'],
	prot: ['#3e69fc', '#786722', '#d1ba2c', '#ffff24', '#b4a231', '#002ac7'],
	trit: ['#cc587b', '#f9105d', '#fc9fb2', '#fdd5dd', '#51dae8', '#17a5b9'],
};

const THEMES: { label: string; value: Theme }[] = [
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

const ColorWheel = ({ type }: { type: Theme }) => {
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
	const fs = useFontSize();

	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	const [updatePreferences, { isLoading }] = useUpdatePreferencesMutation();
	const { user } = useUser();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	let selected = THEMES.find(t => t.value === theme);

	const handleThemeChange = ({ value }: { value: Theme }) => {
		setTheme(value);

		if (user) {
			updatePreferences({
				user_id: user?.id,
				theme: value,
			});
		}
	};

	return (
		<Listbox value={selected} onChange={handleThemeChange}>
			{({ open }) => (
				<>
					<div className={`${fs.sm} relative z-50`}>
						<Listbox.Button
							as="div"
							className="relative appearance-none border focus:outline-none border-accents-8 bg-accents-10 cursor-pointer hover:bg-accents-9 text-accents-3 rounded-md py-[5px] px-[5px]"
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
							<Listbox.Options className="absolute right-0 min-w-[164px] p-1 border border-accents-8 bg-accents-10 text-accents-3 z-10 mt-2 max-h-56 w-full overflow-auto rounded-md py-1 focus:outline-none">
								{THEMES.map(theme => (
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
										{({ selected }) => (
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
