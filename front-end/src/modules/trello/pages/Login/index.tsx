import '@css/trello/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@modules/trello/components/Button.tsx';
export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const handleLogin = () => {
		if (!email || !password) {
			console.log('Please enter both email and password.');
		} else {
			// Perform login logic here
			navigate('/trello/home', { replace: true }); // Redirect to the home page after successful login
		}
	};
	return (
		<div className="page-login">
			<div className="white-box-container">
				<div className="box-login">
					<div className="header">
						<h2 className="title-login">Log in to Trello</h2>
					</div>
					<div className="section-login">
						<form className="form-login">
							<div className="form-group">
								<label htmlFor="email">
									Email{' '}
									<span className="field-required">*</span>
								</label>
								<input
									type="email"
									className="form-control email"
									id="email"
									placeholder="Enter email"
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">
									Password{' '}
									<span className="field-required">*</span>
								</label>
								<input
									type="password"
									className="form-control password"
									id="password"
									placeholder="Password"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
							<div className="form-check">
								<input
									type="checkbox"
									className="form-check-input form-check-input-custom"
									id="remember-me"
								/>
								<label
									className="form-check-label"
									htmlFor="Remember"
								>
									Remember Me
								</label>
							</div>
							<Button
								children="Log in"
								className="btn btn-primary login-button"
								onClick={handleLogin}
							/>
						</form>
					</div>
					<div className="different-method-login">
						<span>Or continue with:</span>
					</div>
					<div className="other-method-login">
						<ul className="auth-method-list">
							<li className="auth-item">
								<button className="google-auth-button social-auth-buttons">
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/google-logo.5867462c.svg"
											alt=""
										/>
									</span>
									<span className="method-name">Google</span>
								</button>
							</li>
							<li className="auth-item">
								<button className="microsoft-auth-button social-auth-buttons">
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/microsoft-logo.c73d8dca.svg"
											alt=""
										/>
									</span>
									<span className="method-name">
										Microsoft
									</span>
								</button>
							</li>
							<li className="auth-item">
								<button className="slack-auth-button social-auth-buttons">
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/slack-logo.5d730c10.svg"
											alt=""
										/>
									</span>
									<span className="method-name">Slack</span>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
