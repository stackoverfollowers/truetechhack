import { RootState } from '@/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useUser = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	return useMemo(() => ({ user }), [user]);
};
