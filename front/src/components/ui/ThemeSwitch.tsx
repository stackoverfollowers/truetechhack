import { useTheme } from 'next-themes';
import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import cx from 'clsx';
import { HiChevronUpDown } from 'react-icons/hi2';
import { FiCheck } from 'react-icons/fi';
import ColorWheel from './ColorWheel';

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
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
		<Listbox value={selected} onChange={t => setTheme(t.value)}>
			{({ open }) => (
				<>
					<div className="relative z-50">
						<Listbox.Button
							as="div"
							className="relative  appearance-none border focus:outline-none border-accents-8 bg-accents-10 text-accents-3 sm:text-sm cursor-default rounded-md py-[5px] px-[5px] "
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
							<Listbox.Options className="absolute -right-3/4 min-w-[160px] p-1 border border-accents-8 bg-accents-10 text-accents-3 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 focus:outline-none text-sm">
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

	return (
		<select value={theme} onChange={e => setTheme(e.target.value)}>
			<option value="default">default</option>
			<option value="prot">prot</option>
			<option value="deut">deut</option>
			<option value="trit">trit</option>
		</select>
	);
};

export default ThemeSwitch;
