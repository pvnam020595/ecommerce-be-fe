// import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Header() {
	return (
		<>
			<div className="sec-header">
				<div className="account-info"></div>
				<div className="sec-hamburger">
					<FontAwesomeIcon icon="bars" />
				</div>
			</div>
		</>
	);
}
export default Header;
