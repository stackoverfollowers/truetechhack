import { useSendTimingFeedbackMutation } from '@/redux/services/user';
import { Popover, Transition } from '@headlessui/react';
import { FormEvent, Fragment, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { HiChat } from 'react-icons/hi';
import Button from '../ui/Button';
import Input from '../ui/Input';

const FeedbackButton = () => {
	const [startTime, setStartTime] = useState<string>();
	const [endTime, setEndTime] = useState<string>();

	const [sendTimingFeedback, { isLoading }] = useSendTimingFeedbackMutation();

	const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (startTime && endTime) {
			sendTimingFeedback({ startTime, endTime });
		}
	};

	return (
		<>
			<Popover className="relative">
				{({ open }) => (
					<>
						<Popover.Button className="flex items-center justify-center h-12 w-12 outline-none">
							<HiChat
								className="h-7 w-7 fill-white shrink-0 cursor-pointer"
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
							<Popover.Panel className="absolute outline-none z-10 mt-3 w-[310px] bottom-10 text-accents-3 right-0 transform rounded-md border border-accents-9 bg-accents-10">
								<div className="relative flex flex-col gap-y-2">
									<div className="flex items-center rounded-lg transition duration-150 ease-in-out p-2">
										<FiEdit
											aria-hidden="true"
											className="h-4 w-4 shrink-0 mr-2"
										/>
										<div className="flex justify-between w-full mr-1 text-sm font-medium">
											Сообщите об опасных кадрах
										</div>
									</div>
									<form
										className="flex flex-col gap-y-2"
										onSubmit={handleSumbit}
									>
										<div className="flex p-2 items-center w-full">
											<span className="mr-2">с</span>
											<Input
												type="time"
												placeholder="01:32:00"
												step="2"
												className="w-[106px]"
												value={startTime}
												onChange={e => setStartTime(e.target.value)}
											/>
											<span className="mx-2">по</span>
											<Input
												type="time"
												placeholder="01:42:00"
												step="2"
												className="w-[106px]"
												value={endTime}
												onChange={e => setEndTime(e.target.value)}
											/>
										</div>

										<div className="flex justify-end border-t border-accents-8 p-2 bg-accents-10">
											<Button
												type="submit"
												disabled={isLoading || !startTime || !endTime}
												loading={isLoading}
											>
												Отправить
											</Button>
										</div>
									</form>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</>
	);
};

export default FeedbackButton;
