import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import useFontSize from '@/hooks/use-font-size';
import { useUploadVideoMutation } from '@/redux/services/stream';
import { useGetUserQuery } from '@/redux/services/user';
import cx from 'clsx';
import Head from 'next/head';
import { ChangeEvent, FormEvent, ReactElement, useRef, useState } from 'react';

const Profile = () => {
	const fs = useFontSize();

	const [file, setFile] = useState<File | null>(null);

	const { data: user, isLoading: isUserLoading } = useGetUserQuery();

	const [uploadVideo, { isLoading: isUploading, isError: isUploadError }] =
		useUploadVideoMutation();

	const fileInputRef = useRef<any>();

	const handleVideoSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
		}

		e.currentTarget.value = '';
	};

	const handleUpload = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (file) {
			uploadVideo(file);
		}
	};

	return (
		<>
			<Head>
				<title>Профиль – stackoverfollowers</title>
			</Head>
			<div className="w-full max-w-7xl flex flex-col gap-y-8">
				<div className="bg-accents-10 rounded-md p-4">
					<h2 style={fs.base} className="font-semibold leading-7">
						Профиль
					</h2>
					<p style={fs.sm} className="mt-1 leading-6 text-accents-6">
						Общие настройки
					</p>

					<div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div style={fs.sm} className="sm:col-span-4">
							<label htmlFor="username" className="block font-medium leading-6">
								Имя пользователя
							</label>
							<div className="mt-2">
								<div className="flex rounded-md overflow-hidden border border-accents-8 focus-within:border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 sm:max-w-md">
									<span className="flex h-8 select-none items-center px-3 text-primary/80 bg-accents-9 border-r border-accents-8">
										stackoverfollowers/
									</span>
									<span className="flex h-8 items-center pl-2">
										{user?.username}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<form className="bg-accents-10 rounded-md p-4" onSubmit={handleUpload}>
					<div className="border-b border-accents-8 pb-4">
						<h2 style={fs.base} className="font-semibold leading-7">
							Видео
						</h2>
						<p style={fs.sm} className="mt-1 leading-6 text-accents-6">
							Загруженное видео предварительно пройдент обработку на бэкенде для
							выявления <b>потенциально эпилептических кадров</b>, после чего
							появится в списке видео под плеером. Обработка больших файлов
							занимает больше времени.
						</p>
						<div style={fs.sm} className="col-span-full mt-8">
							<div className="mt-2">
								<div className="flex">
									<input
										id="fileInput"
										ref={fileInputRef}
										type="file"
										accept="video/mp4"
										onChange={handleVideoSelect}
										className="hidden"
										placeholder="username"
									/>
									{!file ? (
										<Button
											variant="secondary"
											onClick={() => fileInputRef.current.click()}
										>
											Загрузить
										</Button>
									) : (
										<div className="flex items-center gap-x-3">
											<div className="text-primary/80 w-fit rounded-md border border-accents-8 focus-within:border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 px-3 py-[5px]">
												{file && file.name}
											</div>

											<Button
												variant="secondary"
												onClick={() => setFile(null)}
												disabled={isUploading}
											>
												Удалить
											</Button>
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
							<span className={`${fs.sm} text-error`}>
								Повторите попытку позже.
							</span>
						)}
						<Button type="submit" disabled={isUploading || !file}>
							Сохранить
						</Button>
					</div>
				</form>
			</div>
		</>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Profile;
