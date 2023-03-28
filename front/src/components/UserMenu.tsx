import { useAppDispatch } from '@/redux/hooks';
import { clearCredentials } from '@/redux/slices/authSlice';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import cx from 'clsx';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';

const UserMenu = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(clearCredentials());
		router.replace('/');
	};

	const userNavigation = [
		{ name: 'Профиль', href: '/profile' },
		{ name: 'Настройки', href: '#' },
	];

	return (
		<Menu as="div" className="relative ml-3">
			<div>
				<Menu.Button className="flex max-w-xs items-center rounded-full bg-accents-9 p-[6px] text-sm border focus:outline-none focus:ring-4 border-accents-8 focus:border-primary focus:ring-primary/10 ">
					<span className="sr-only">Open user menu</span>
					<FiUser className="h-5 w-5" />
					{/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 min-w-[164px] p-1 border border-accents-8 bg-accents-10 text-accents-3 z-50 mt-2 max-h-56 w-full overflow-auto rounded-md py-1 focus:outline-none text-sm">
					{userNavigation.map(item => (
						<Menu.Item key={item.name}>
							<Link
								href={item.href}
								className={cx(
									'relative flex items-center px-3 py-[5px] cursor-default select-none rounded-md',
									'hover:bg-accents-9 hover:text-accents-2'
								)}
							>
								{item.name}
							</Link>
						</Menu.Item>
					))}
					<div className="border-b border-accents-8 w-full my-2" />
					<Menu.Item>
						<button
							onClick={handleLogout}
							className={cx(
								'relative flex w-full items-center px-3 py-[5px] cursor-default select-none rounded-md',
								'hover:bg-accents-9 hover:text-accents-2'
							)}
						>
							Выйти
						</button>
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default UserMenu;
