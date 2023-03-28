import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import UserMenu from '../UserMenu';
import Button from './Button';

interface LoginButtonProps {
	className?: string;
}

const LoginButton = ({ className }: LoginButtonProps) => {
	const { user } = useUser();

	if (user) {
		return <UserMenu />;
	}
	return (
		<>
			<Button Component={Link} className={className} href="/login">
				Войти
			</Button>
		</>
	);
};

export default LoginButton;
