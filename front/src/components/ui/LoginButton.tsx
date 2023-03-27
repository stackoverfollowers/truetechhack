import { useUser } from '@/hooks/use-user';
import { clearCredentials } from '@/services/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Button from './Button';

interface LoginButtonProps {
	className?: string;
}

const LoginButton = ({ className }: LoginButtonProps) => {
	const { user } = useUser();
	const dispatch = useDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(clearCredentials());
		router.replace('/');
	};

	if (user) {
		return (
			<>
				<Button className={className} onClick={handleLogout}>
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
