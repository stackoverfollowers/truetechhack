import cn from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const Input: React.FC<InputProps> = props => {
	const { className, children, ...rest } = props;

	const rootClassName = cn(
		'w-[300px] appearance-none rounded-md border px-3 py-[5px] focus:outline-none focus:ring-4 border-accents-8 bg-accents-10 text-accents-3 placeholder:text-accents-6 focus:border-primary focus:ring-primary/10 sm:text-sm',
		{},
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
