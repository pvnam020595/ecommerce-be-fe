import ButtonPropsInterface from '@modules/trello/interfaces/Button.ts';
function Button({ children, onClick, className }: ButtonPropsInterface) {
	return (
		<button className={`btn ${className}`} onClick={onClick}>
			{children}
		</button>
	);
}
export default Button;
