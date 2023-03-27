import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ReactElement } from 'react';
import { FiUser, FiVideo } from 'react-icons/fi';

const Profile = () => {
	return (
		<div className="w-full max-w-7xl flex flex-col gap-y-8">
			<div className="bg-accents-10 rounded-md p-4">
				<div className="border-b border-accents-8 pb-12 space-y-6">
					<h2 className="text-lg font-semibold leading-7">Профиль</h2>

					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div className="sm:col-span-4">
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6"
							>
								Имя пользователя
							</label>
							<div className="mt-2">
								<div className="flex rounded-md border border-accents-8 focus-within:border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 sm:max-w-md">
									<span className="flex select-none items-center pl-3 text-primary/80 sm:text-sm">
										stackoverfollowers/
									</span>
									<Input
										type="text"
										name="username"
										id="username"
										className="block flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0"
										placeholder="username"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end">
					<Button type="submit">Сохранить</Button>
				</div>
			</div>
			<div className="bg-accents-10 rounded-md p-4">
				<div className="border-b border-accents-8 pb-12">
					<h2 className="text-lg font-semibold leading-7">Видео</h2>

					<div className="col-span-full mt-10">
						<div className="mt-2 flex items-center gap-x-3">
							<FiVideo className="h-6 w-6 text-gray-300" aria-hidden="true" />
							<Button type="button">Загрузить</Button>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end">
					<Button type="submit">Сохранить</Button>
				</div>
			</div>
		</div>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Profile;
