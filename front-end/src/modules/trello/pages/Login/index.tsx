import '@css/trello/login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '@modules/trello/components/Button';
import { PATHS } from '@router/paths';
import { authenticateUser } from '@mock/api/auth/mockUser';

export const Login = () => {
	const [email, setEmail] = useState('p_vannam@thk-hd.vn');
	const [password, setPassword] = useState('password123');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (!email.trim() || !password.trim()) {
			setError('Please enter both email and password.');
			return;
		}

		const user = authenticateUser(email, password);
		if (!user) {
			setError(
				'Invalid credentials. (Hint: p_vannam@thk-hd.vn / password123)'
			);
			return;
		}

		dispatch({
			type: 'LOGIN',
			payload: {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: user.avatar
			}
		});

		navigate(PATHS.TRELLO.HOME, { replace: true });
	};

	return (
		<div className="page-login">
			<div className="white-box-container">
				<div className="box-login">
					<div className="header">
						<h2 className="title-login">Log in to Trello</h2>
					</div>
					<div className="section-login">
						<form className="form-login" onSubmit={handleLogin}>
							{error && (
								<div
									className="alert alert-danger py-2 px-3 mb-3 small"
									role="alert"
								>
									{error}
								</div>
							)}

							<div className="form-group mb-3">
								<label htmlFor="email">
									Email{' '}
									<span className="field-required text-danger">
										*
									</span>
								</label>
								<input
									type="email"
									className="form-control email"
									id="email"
									placeholder="Enter email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="form-group mb-3">
								<label htmlFor="password">
									Password{' '}
									<span className="field-required text-danger">
										*
									</span>
								</label>
								<input
									type="password"
									className="form-control password"
									id="password"
									placeholder="Password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
							</div>

							<div className="form-check mb-3">
								<input
									type="checkbox"
									className="form-check-input form-check-input-custom"
									id="remember-me"
									defaultChecked
								/>
								<label
									className="form-check-label"
									htmlFor="remember-me"
								>
									Remember Me
								</label>
							</div>

							<Button className="btn btn-primary login-button w-100">
								Log in
							</Button>
						</form>
					</div>

					<div className="different-method-login my-3 text-center">
						<span className="text-muted small">
							Or continue with:
						</span>
					</div>

					<div className="other-method-login">
						<ul className="auth-method-list list-unstyled d-flex flex-column gap-2 p-0">
							<li className="auth-item">
								<button
									type="button"
									className="google-auth-button social-auth-buttons btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => {
										const user =
											authenticateUser(
												'p_vannam@thk-hd.vn'
											);
										if (user) {
											dispatch({
												type: 'LOGIN',
												payload: user
											});
											navigate(PATHS.TRELLO.HOME, {
												replace: true
											});
										}
									}}
								>
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/google-logo.5867462c.svg"
											alt="Google"
											style={{
												width: '18px',
												height: '18px'
											}}
										/>
									</span>
									<span className="method-name">Google</span>
								</button>
							</li>
							<li className="auth-item">
								<button
									type="button"
									className="microsoft-auth-button social-auth-buttons btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => {
										const user =
											authenticateUser(
												'p_vannam@thk-hd.vn'
											);
										if (user) {
											dispatch({
												type: 'LOGIN',
												payload: user
											});
											navigate(PATHS.TRELLO.HOME, {
												replace: true
											});
										}
									}}
								>
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/microsoft-logo.c73d8dca.svg"
											alt="Microsoft"
											style={{
												width: '18px',
												height: '18px'
											}}
										/>
									</span>
									<span className="method-name">
										Microsoft
									</span>
								</button>
							</li>
							<li className="auth-item">
								<button
									type="button"
									className="slack-auth-button social-auth-buttons btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => {
										const user =
											authenticateUser(
												'p_vannam@thk-hd.vn'
											);
										if (user) {
											dispatch({
												type: 'LOGIN',
												payload: user
											});
											navigate(PATHS.TRELLO.HOME, {
												replace: true
											});
										}
									}}
								>
									<span className="method-icon">
										<img
											src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/slack-logo.5d730c10.svg"
											alt="Slack"
											style={{
												width: '18px',
												height: '18px'
											}}
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

export default Login;
