import { useLoginMutation } from '@/services/auth';
import { setCredentials } from '@/services/authSlice';
import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const SignIn = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useDispatch();

	const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const authenticate = async () => {
			const user = await login({ username, password }).unwrap();

			console.log('user', user);

			dispatch(setCredentials(user as any));
		};

		authenticate().catch(console.error);
	};

	return (
		<>
			<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div>
						<img
							className="mx-auto h-12 w-auto"
							src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
							alt="Your Company"
						/>
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
							Sign in to your account
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleSumbit}>
						<input type="hidden" name="remember" defaultValue="true" />
						<div className="-space-y-px rounded-md shadow-sm">
							<div>
								<label htmlFor="username" className="sr-only">
									Имя пользователя
								</label>
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="off"
									required
									value={username}
									onChange={e => setUsername(e.target.value)}
									className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Пароль
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={password}
									onChange={e => setPassword(e.target.value)}
									className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Password"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Войти
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default SignIn;
