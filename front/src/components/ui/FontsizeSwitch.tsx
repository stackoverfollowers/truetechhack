import { useUpdatePreferencesMutation } from '@/redux/services/user';
import { useUser } from '@/hooks/use-user';
import useFontSize from '@/hooks/use-font-size';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAccessibleFontSize } from '@/redux/slices/themeSlice';

const FontsizeSwitch = () => {
	const fs = useFontSize();

	const dispatch = useAppDispatch();
	const [updatePreferences, { isLoading: isUpdating }] =
		useUpdatePreferencesMutation();
	const { user } = useUser();

	const accessibleFs = useAppSelector(state => state.theme.accessibleFs);

	const handleFontChange = () => {
		dispatch(setAccessibleFontSize());

		// if (user) {
		// 	updatePreferences({ user_id: user?.id, fs: value });
		// }
	};

	return (
		<button
			onClick={handleFontChange}
			style={fs.sm}
			className="relative w-8 h-8 flex items-center justify-center appearance-none border focus:outline-none border-accents-8 bg-accents-10 cursor-pointer hover:bg-accents-9 text-accents-3 rounded-md py-[5px] px-[5px]"
		>
			A
		</button>
	);
};

export default FontsizeSwitch;
