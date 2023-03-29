import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useFontSize from '@/hooks/use-font-size';
import { useAppDispatch } from '@/redux/hooks';
import { useSigninMutation } from '@/redux/services/auth';
import { UserPreferences } from '@/redux/services/user';
import { setCredentials } from '@/redux/slices/authSlice';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const SignIn = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const { theme, setTheme } = useTheme();
	const fs = useFontSize();

	const [signin, { isLoading: isSigningIn }] = useSigninMutation();
	const dispatch = useAppDispatch();

	const router = useRouter();

	const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const authenticate = async () => {
			const user = await signin({ username, password }).unwrap();

			dispatch(setCredentials(user as any));
			const response = await fetch(
				`http://${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/preferences`,
				{
					headers: { Authorization: `Bearer ${user.access_token}` },
				}
			);
			const data: UserPreferences = await response.json();

			setTheme(data.theme);

			router.push('/');
		};

		authenticate().catch(() => setError('Что-то пошло не так'));
	};

	return (
		<>
			<Head>
				<title>Вход – stackoverfollowers</title>
			</Head>
			<div className="flex w-full max-w-7xl min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div className="flex flex-col justify-center items-center">
						<Image width={48} height={48} alt="Logo" src="logo.svg" />

						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
							Вход в аккаунт
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleSumbit}>
						<div className="space-y-2">
							<div>
								<label htmlFor="username" className="sr-only">
									Имя пользователя
								</label>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="off"
									required
									value={username}
									className="w-full"
									onChange={e => setUsername(e.target.value)}
									placeholder="Имя пользователя"
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Пароль
								</label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? 'text' : 'password'}
										autoComplete="current-password"
										required
										value={password}
										onChange={e => setPassword(e.target.value)}
										className="w-full pr-10"
										placeholder="Пароль"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute top-[25%] right-3 text-accents-6"
									>
										{showPassword ? <FiEye /> : <FiEyeOff />}
									</button>
								</div>
							</div>
						</div>
						{error && (
							<span style={fs.sm} className="text-error">
								{error}
							</span>
						)}

						<div style={fs.sm} className="flex items-center justify-between">
							<span>У вас ещё нет аккаунта?</span>
							<Link
								href="/register"
								className="font-medium text-primary hover:text-primary"
							>
								Зарегистрироваться
							</Link>
						</div>

						<Button
							className="w-full"
							type="submit"
							disabled={isSigningIn}
							loading={isSigningIn}
						>
							Войти
						</Button>
					</form>
				</div>
			</div>
		</>
	);
};

SignIn.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default SignIn;
