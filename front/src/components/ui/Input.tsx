import cn from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	onChange?: (...args: any[]) => any;
}

const Input: React.FC<InputProps> = props => {
	const { className, children, onChange, ...rest } = props;

	const rootClassName = cn(
		'w-[300px] appearance-none rounded-md border px-3 py-[5px] shadow-zinc-800/5 focus:outline-none focus:ring-4 border-zinc-700 bg-zinc-700/[0.15] text-zinc-200 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400/10 sm:text-sm',
		{},
		className
	);

	const handleOnChange = (e: any) => {
		if (onChange) {
			onChange(e.target.value);
		}
		return null;
	};

	return (
		<label>
			<input
				className={rootClassName}
				onChange={handleOnChange}
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
