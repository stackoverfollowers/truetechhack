import useFontSize from '@/hooks/use-font-size';
import cx from 'clsx';
import React, {
	forwardRef,
	ButtonHTMLAttributes,
	JSXElementConstructor,
} from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	variant?: 'default' | 'secondary';
	Component?: string | JSXElementConstructor<any>;
	width?: string | number;
	loading?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
	const {
		className,
		children,
		width,
		variant = 'default',
		style = {},
		Component = 'button',
		loading = false,
		disabled = false,
		...rest
	} = props;

	const fs = useFontSize();

	const rootClassName = cx(
		'rounded-md py-[5px] px-3 flex justify-center items-center font-semibold text-center outline-none min-h-[32px]',
		fs.sm,
		{
			'bg-accents-7 hover:bg-accents-6': variant === 'default',
			'border border-accents-8 bg-accents-10 hover:bg-accents-9':
				variant === 'secondary',
			'pointer-events-none ': loading,
			'opacity-70 pointer-events-none': disabled,
		},
		className
	);

	return (
		<Component className={rootClassName} style={{ width, ...style }} {...rest}>
			{loading ? (
				<svg
					className="animate-spin h-5 w-5 text-accents-1"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : (
				children
			)}
		</Component>
	);
});

Button.displayName = 'Button';

export default Button;
