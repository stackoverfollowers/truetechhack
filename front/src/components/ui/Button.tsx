import cn from 'clsx';
import React, {
	forwardRef,
	ButtonHTMLAttributes,
	JSXElementConstructor,
} from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	Component?: string | JSXElementConstructor<any>;
	width?: string | number;
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
	const {
		className,
		children,
		width,
		style = {},
		Component = 'button',
		...rest
	} = props;

	return (
		<Component
			className="rounded-md py-2 px-3 text-sm font-semibold shadow-sm outline-none bg-yellow-600 text-white hover:bg-yellow-500"
			style={{ width, ...style }}
			{...rest}
		>
			{children}
		</Component>
	);
});

Button.displayName = 'Button';

export default Button;
