import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { useUploadVideoMutation } from '@/redux/services/stream';
import { useGetUserQuery } from '@/redux/services/user';
import cx from 'clsx';
import { ChangeEvent, FormEvent, ReactElement, useRef, useState } from 'react';

const Profile = () => {
	const [video, setVideo] = useState<File | null>(null);

	const { data: user, isLoading: isUserLoading } = useGetUserQuery();

	const [uploadVideo, { isLoading: isUploading, isError: isUploadError }] =
		useUploadVideoMutation();

	const fileInputRef = useRef<any>();

	const handleVideoSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setVideo(selectedFile);
		}
	};

	const handleUpload = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (video) {
			const payload = uploadVideo(video).unwrap();
		}

		// @ts-ignore
		fileInputRef.value = '';
	};

	return (
		<div className="w-full max-w-7xl flex flex-col gap-y-8">
			<div className="bg-accents-10 rounded-md p-4">
				<h2 className="text-lg font-semibold leading-7">Профиль</h2>
				<p className="mt-1 text-sm leading-6 text-accents-6">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</p>

				<div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div className="sm:col-span-4">
						<label
							htmlFor="username"
							className="block text-sm font-medium leading-6"
						>
							Имя пользователя
						</label>
						<div className="mt-2">
							<div className="flex rounded-md border border-accents-8 focus-within:border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 sm:max-w-md">
								<span className="flex h-8 select-none items-center pl-3 text-primary/80 text-sm">
									stackoverfollowers/
								</span>
								<span className="text-sm py-[5px] pl-1">{user?.username}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<form className="bg-accents-10 rounded-md p-4" onSubmit={handleUpload}>
				<div className="border-b border-accents-8 pb-12">
					<h2 className="text-lg font-semibold leading-7">Видео</h2>
					<p className="mt-1 text-sm leading-6 text-accents-6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</p>

					<div className="col-span-full mt-8">
						<div className="mt-2">
							<div className="flex w-fit rounded-md border border-accents-8 focus-within:border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
								<input
									id="fileInput"
									ref={fileInputRef}
									type="file"
									accept="video/mp4"
									onChange={handleVideoSelect}
									className="hidden"
									placeholder="username"
								/>
								{!video ? (
									<button
										className="text-sm px-3 py-[5px]"
										onClick={() => fileInputRef.current.click()}
									>
										Загрузить
									</button>
								) : (
									<div className="flex items-center px-3 gap-x-3">
										<div className="text-sm text-primary/80">
											{video && video.name}
										</div>

										<button
											className="text-sm  py-[5px]"
											onClick={() => setVideo(null)}
											disabled={isUploading}
										>
											Удалить
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div
					className={cx(
						isUploadError ? 'justify-between' : 'justify-end',
						'mt-4 flex items-center'
					)}
				>
					{isUploadError && (
						<span className="text-error text-sm">Повторите попытку позже.</span>
					)}
					<Button type="submit" disabled={isUploading}>
						Сохранить
					</Button>
				</div>
			</form>
		</div>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Profile;
