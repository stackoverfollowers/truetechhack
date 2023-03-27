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
			className="rounded-md py-[5px] px-3 text-sm font-semibold shadow-sm outline-none bg-accents-6 text-accents-2 hover:bg-accents-5"
			style={{ width, ...style }}
			{...rest}
		>
			{children}
		</Component>
	);
});

Button.displayName = 'Button';

export default Button;
