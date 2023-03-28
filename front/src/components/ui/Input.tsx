import useFontSize from '@/hooks/use-font-size';
import cn from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const Input: React.FC<InputProps> = props => {
	const { className, children, ...rest } = props;

	const fs = useFontSize();

	const rootClassName = cn(
		'w-full appearance-none max-h-[32px] rounded-md border px-3 py-[5px] focus:outline-none focus:ring-4 border-accents-8 bg-accents-11 text-accents-3 placeholder:text-accents-6 focus:border-primary focus:ring-primary/10',
		fs.sm,
		className
	);

	return (
		<label>
			<input
				className={rootClassName}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck="false"
				{...rest}
			/>
		</label>
	);
};

export default Input;
