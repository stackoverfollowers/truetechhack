import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSignupMutation } from '@/services/auth';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [showPassword, setShowPassword] = useState(false);

	const [signup, { isLoading }] = useSignupMutation();

	const router = useRouter();

	const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const register = async () => {
			await signup({ username, password }).unwrap();
			router.push('/');
		};

		register().catch(() => setError('Что-то пошло не так'));
	};

	return (
		<>
			<div className="flex w-full max-w-7xl min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div>
						<img
							className="mx-auto h-12 w-auto"
							src="https://tailwindui.com/img/logos/mark.svg?color=white"
							alt=""
						/>
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
							Регистрация
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
						{error && <span className="text-error text-sm">{error}</span>}

						<Button className="w-full" type="submit" disabled={isLoading}>
							Создать аккаунт
						</Button>
					</form>
				</div>
			</div>
		</>
	);
};

SignUp.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default SignUp;
