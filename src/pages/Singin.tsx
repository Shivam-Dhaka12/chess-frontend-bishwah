//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Form from '../Components/Form';
import axios, { isAxiosError } from 'axios';
import TokenManager from '../utils/TokenManager';
import useShowAlert from '../utils/useShowAlert';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/Auth';

function Login() {
	const navigate = useNavigate();
	const setAuthState = useSetRecoilState(authState);

	const [postInputs, setPostInputs] = useState({
		username: '',
		password: '',
	});

	const showAlert = useShowAlert();

	async function sendRequest() {
		try {
			const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`;
			const response = await axios.post(url, postInputs);
			const jwt = response.data.token;
			TokenManager.set(jwt);
			setAuthState('true');

			navigate('/room');
			showAlert({
				show: true,
				type: 'primary',
				msg: 'Logged in successfully',
			});
			//
		} catch (error) {
			let errorMsg = 'Something went wrong';
			if (isAxiosError(error) && error.response) {
				errorMsg = error.response.data.message;
			}
			showAlert({
				show: true,
				type: 'error',
				msg: errorMsg,
			});
			console.error(error);
		}
	}
	return (
		<Form>
			<form
				className=" flex flex-col"
				onSubmit={(e) => {
					if (e) {
						e.preventDefault();
					}
					sendRequest();
					return;
				}}
			>
				<h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center text-white mb-10 md:mb-16">
					Log
					<span className="text-sky-500">i</span>n
				</h1>
				<input
					type="username"
					placeholder="Username"
					value={postInputs.username}
					onChange={(e) =>
						setPostInputs((c) => ({
							...c,
							username: e.target.value,
						}))
					}
					className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors
					"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={postInputs.password}
					onChange={(e) =>
						setPostInputs((c) => ({
							...c,
							password: e.target.value,
						}))
					}
					className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors white-eye"
					required
				/>

				<button
					className="mt-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
					type="submit"
				>
					Login
				</button>

				<p className="mt-6 text-sm  text-center max-w-3xl mx-auto text-slate-400">
					Doesn't have an account?{' '}
					<span
						onClick={() => {
							// onSetForm("signup");
							navigate('/signup');
						}}
						className="block underline cursor-pointer font-mono font-medium  text-sky-400"
					>
						SignUp
					</span>
				</p>
			</form>
		</Form>
	);
}

export default Login;
