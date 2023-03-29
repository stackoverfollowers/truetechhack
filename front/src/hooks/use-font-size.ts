import { useAppSelector } from '@/redux/hooks';

const useFontSize = () => {
	const accessibleFs = useAppSelector(state => state.theme.accessibleFs);

	const fontSizeToClassName = () => {
		switch (!accessibleFs) {
			case true:
				return {
					xs: { fontSize: '12px' },
					sm: { fontSize: '14px' },
					base: { fontSize: '16px' },
				};
			case false:
				return {
					xs: { fontSize: '16px' },
					sm: { fontSize: '20px' },
					base: { fontSize: '24px' },
				};
		}
	};

	return fontSizeToClassName();
};

export default useFontSize;
