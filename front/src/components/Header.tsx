import { useState } from 'react';
import { Dialog } from '@headlessui/react';

import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Input from './ui/Input';
import ThemeSwitch from './ui/ThemeSwitch';
import LoginButton from './ui/LoginButton';
import Image from 'next/image';
import FontsizeSwitch from './ui/FontsizeSwitch';
import useFontSize from '@/hooks/use-font-size';

const Header = () => {
	const fs = useFontSize();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navigation = [
		{
			label: 'Главная',
			href: '/',
		},
		{
			label: 'Фильмы',
			href: '#',
		},
		{
			label: 'Сериалы',
			href: '#',
		},
	];

	return (
		<header className="shadow mb-12 ring-1 bg-accents-10 ring-white/10">
			<nav
				className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
				aria-label="Global"
			>
				<Link href="/" className="flex shrink-0 mr-4">
					<Image width={32} height={32} alt="Logo" src="logo.svg" />
				</Link>
				<div className="flex sm:hidden">
					<button type="button" onClick={() => setMobileMenuOpen(true)}>
						<span className="sr-only">Open main menu</span>
						<FiMenu className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div className="hidden sm:flex sm:gap-x-4">
					{navigation.map(({ label, href }, i) => (
						<Link
							href={href}
							key={i}
							style={fs.base}
							className="font-semibold relative block transition hover:text-primary"
						>
							{label}
						</Link>
					))}
				</div>
				<div className="hidden sm:flex sm:flex-1 sm:justify-end sm:items-center gap-x-2">
					<FontsizeSwitch />
					<ThemeSwitch />
					<Input placeholder="Поиск" className="w-[200px]" />
					<LoginButton />
				</div>
			</nav>

			<Dialog
				as="div"
				className="sm:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-10" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full bg-accents-10 overflow-y-auto p-4">
					<div className="flex items-center justify-between">
						<Image width={32} height={32} alt="Logo" src="logo.svg" />
						<button type="button" onClick={() => setMobileMenuOpen(false)}>
							<span className="sr-only">Close menu</span>
							<FiX className="h-6 w-6 text-accents-2" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6">
						<div style={fs.base} className={`grid grid-cols-2 gap-2`}>
							{navigation.map(({ label, href }, i) => (
								<a
									href={href}
									key={i}
									className="-mx-3 block rounded-lg py-2 px-3 font-semibold leading-7 relative transition hover:text-primary"
								>
									{label}
								</a>
							))}
						</div>
					</div>
					<div className="my-4 border-t border-accents-8" />
					<div className="flex items-center justify-between w-fit gap-x-8">
						<span style={fs.base} className="font-semibold leading-7">
							Настройка темы
						</span>
						<ThemeSwitch />
						<FontsizeSwitch />
					</div>
					<div className="my-4 border-t border-accents-8" />
					<div className="flex w-full">
						<LoginButton className="w-full" />
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default Header;
