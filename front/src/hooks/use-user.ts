import { RootState } from '@/redux/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useUser = () => {
	// const { data: user, isLoading } = useGetUserQuery();

	// console.log('useUser user', user, isLoading);

	// useEffect(() => {
	// 	if (!isLoading && !user) {
	// 		// Handle error or redirect to login page

	// 	}
	// }, [isLoading, user]);
	// return { user, isLoading };

	const user = useSelector((state: RootState) => state.auth.user);
	return useMemo(() => ({ user }), [user]);
};
