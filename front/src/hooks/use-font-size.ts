import { useAppSelector } from '@/redux/hooks';

const useFontSize = () => {
	const accessibleFs = useAppSelector(state => state.theme.accessibleFs);

	const fontSizeToClassName = () => {
		switch (accessibleFs) {
			case true:
				return {
					xs: 'text-xs',
					sm: 'text-sm',
					base: 'text-base',
				};
			case false:
				return {
					xs: 'text-base',
					sm: 'text-lg',
					base: 'text-xl',
				};
		}
	};

	return fontSizeToClassName();
};

export default useFontSize;
