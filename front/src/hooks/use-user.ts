import { useAppSelector } from '@/redux/hooks';
import { useMemo } from 'react';

export const useUser = () => {
	const user = useAppSelector(state => state.auth.user);
	return useMemo(() => ({ user }), [user]);
};
