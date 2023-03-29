import useFontSize from '@/hooks/use-font-size';
import { useAppSelector } from '@/redux/hooks';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiInfo, FiList } from 'react-icons/fi';

const InfoButton = () => {
	const fs = useFontSize();

	const epilepticTimings = useAppSelector(
		state => state.player.epilepticTimings
	);

	if (!epilepticTimings) {
		return null;
	}

	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button className="flex items-center justify-center h-12 w-12 outline-none">
						<FiInfo
							className="h-7 w-7 fill-primary text-black shrink-0 cursor-pointer"
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
						<Popover.Panel className="absolute z-10 mt-3 min-w-[280px] w-fit bottom-10 text-accents-3 right-0 transform rounded-md border border-accents-9 bg-accents-10">
							<div style={fs.sm} className="relative flex flex-col gap-y-2 p-2">
								<div className="flex items-center rounded-lg transition duration-150 ease-in-out text-primary">
									<FiList
										aria-hidden="true"
										className="h-4 w-4 shrink-0 mr-2"
									/>
									<div className="flex justify-between w-full mr-1 font-medium">
										Предупреждение об эпилепсии
									</div>
								</div>
								<ul className="flex flex-col gap-y-2">
									{epilepticTimings?.map((t, i) => (
										<li className="list-none" key={i}>
											с {t.start_time}с по {t.end_time}с
										</li>
									))}
								</ul>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

export default InfoButton;
