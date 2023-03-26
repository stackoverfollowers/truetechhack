import { useState } from 'react';
import { Dialog } from '@headlessui/react';

import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Input from './ui/Input';

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navigation = [
		{
			label: 'Главная',
			href: '#',
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
		<header className="shadow mb-12 text-sm font-medium ring-1 bg-zinc-900 text-zinc-200 ring-white/10">
			<nav
				className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
				aria-label="Global"
			>
				<div className="flex lg:flex-1 shrink-0">
					<img
						className="h-8 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
					/>
				</div>
				<div className="flex sm:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<FiMenu className="h-6 w-6 text-zinc-100" aria-hidden="true" />
					</button>
				</div>
				<div className="hidden sm:flex">
					{navigation.map(({ label, href }, i) => (
						<Link
							href={href}
							key={i}
							className="text-base px-4 font-semibold relative block transition hover:text-yellow-400"
						>
							{label}
						</Link>
					))}
				</div>
				<div className="hidden sm:flex sm:flex-1 sm:justify-end">
					<Input placeholder="Поиск" />
				</div>
			</nav>
			<Dialog
				as="div"
				className="sm:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-10" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full bg-zinc-900 overflow-y-auto  p-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<img
							className="h-8 w-auto shrink-0"
							src="https://tailwindui.com/img/logos/mark.svg?color=white"
							alt=""
						/>
						<button
							type="button"
							className="rounded-md  text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<FiX className="h-6 w-6 text-zinc-100" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6">
							<div className="space-y-2 py-6 text-base text-zinc-300">
								{navigation.map(({ label, href }, i) => (
									<a
										href={href}
										key={i}
										className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 relative transition hover:text-yellow-400"
									>
										{label}
									</a>
								))}
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default Header;
