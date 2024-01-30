/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import authService, { AuthSuccessResponse } from '../../services/authService';
import TokenManager from '../../utils/TokenManager';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/atoms/Auth';
import Form from '../Form';

const Login = () => {
	const navigate = useNavigate();
	const [, setAuthToken] = useRecoilState<string>(authState);
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const { mutate, reset } = useMutation({ mutationFn: authService.login });

	const onLoginSuccess = useCallback(
		(responseData: AuthSuccessResponse) => {
			const { token } = responseData;
			if (token) {
				TokenManager.set(token);
				// LOGIC to navigate and store the token
				setAuthToken(token);
				navigate('/user/Game');
			} else {
				console.error('ERROR WHILE LOGIN. PLEASE TRY AGAIN');
			}
		},
		[navigate, setAuthToken]
	);

	const onLoginError = (error: any) => {
		console.error(`ERROR WHILE LOGIN. PLEASE TRY AGAIN, ${error}`);
	};

	const handleLogin = useCallback((username: string, password: string) => {
		console.log('username', username);
		console.log('password', password);

		mutate(
			{
				username,
				password: window.btoa(password),
			},
			{
				onSuccess: onLoginSuccess,
				onError: onLoginError,
				onSettled: () => reset(),
			}
		);
		// return username;
	}, []);

	return (
		<Form>
			<form
				className=" flex flex-col"
				onSubmit={(e) => {
					if (e) {
						e.preventDefault();
					}
					return;
				}}
			>
				<h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white mb-16">
					Log
					<span className="text-sky-500">i</span>n
				</h1>
				<input
					type="username"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors
					"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors white-eye"
				/>

				<button
					className="mt-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
					onClick={() => handleLogin(username, password)}
				>
					Login
				</button>

				<p className="mt-6 text-sm text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
					Doesn't have an account?{' '}
					<span
						onClick={() => {
							// onSetForm("signup");
							navigate('/signup');
						}}
						className="block underline cursor-pointer font-mono font-medium text-sky-500 dark:text-sky-400"
					>
						SignUp
					</span>
				</p>
			</form>
		</Form>
	);
};

export default Login;
