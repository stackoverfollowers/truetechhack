import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import Button from './Button';

interface LoginButtonProps {
	className?: string;
}

const LoginButton = ({ className }: LoginButtonProps) => {
	const { user } = useUser();
	console.log('LoginButton user', user);

	if (user) {
		return (
			<>
				<Button className={className} onClick={() => {}}>
					Выйти
				</Button>
			</>
		);
	}
	return (
		<>
			<Button Component={Link} className={className} href="/auth/signin">
				Войти
			</Button>
		</>
	);
};

export default LoginButton;
