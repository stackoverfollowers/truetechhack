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
	variant?: 'default' | 'primary';
	Component?: string | JSXElementConstructor<any>;
	width?: string | number;
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
	const {
		className,
		children,
		width,
		variant = 'default',
		style = {},
		Component = 'button',
		...rest
	} = props;

	return (
		<Component
			className={cx(
				className,
				'rounded-md py-[5px] px-3 text-sm font-semibold text-center outline-none bg-accents-1 text-black hover:bg-accents-3',
				'disabled:opacity-50 disabled:pointer-events-none'
			)}
			style={{ width, ...style }}
			{...rest}
		>
			{children}
		</Component>
	);
});

Button.displayName = 'Button';

export default Button;
