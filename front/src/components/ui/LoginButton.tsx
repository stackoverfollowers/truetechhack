import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import Button from './Button';

const LoginButton = () => {
	const { user } = useUser();
	console.log('LoginButton user', user);

	if (user) {
		return (
			<>
				<Button onClick={() => {}}>Выйти</Button>
			</>
		);
	}
	return (
		<>
			<Button Component={Link} href="/auth/signin">
				Войти
			</Button>
		</>
	);
};

export default LoginButton;
