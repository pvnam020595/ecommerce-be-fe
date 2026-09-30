import React from 'react';

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className: string;
}

const Button: React.FC<ButtonProps> = ({
	children,
	className = '',
	type = 'button',
	...rest
}) => {
	return (
		<button type={type} className={className} {...rest}>
			{children}
		</button>
	);
};

export default Button;
