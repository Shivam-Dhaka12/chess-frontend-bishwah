import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Form from '../Components/Form';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/Auth';
import Loader from '../Components/Loader';
import { useRequest } from '../hooks/useRequest';
import { userState } from '../recoil/atoms/User';
import { getSocketInstance, handleSocketError } from '../utils/socketManager';
import useShowAlert from '../hooks/useShowAlert';
import tokenManager from '../utils/tokenManager';

function Login() {
	const navigate = useNavigate();
	const setAuthState = useSetRecoilState(authState);
	const setUserState = useSetRecoilState(userState);
	const setAlert = useShowAlert();

	const { sendRequest, loading } = useRequest();

	const [postInputs, setPostInputs] = useState({
		username: '',
		password: '',
	});

	const url = '/api/auth/signin';
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (e) {
			e.preventDefault();
		}
		const response = await sendRequest(
			url,
			'/user/room',
			postInputs,
			'Log in successful!'
		);
		if (response) {
			const { jwt, username } = response.data;
			tokenManager.set(jwt);
			setAuthState('true');
			setUserState({ username });

			try {
				const socket = getSocketInstance(jwt);
				handleSocketError(socket);
			} catch (error) {
				console.log(error);
				setAlert({
					show: true,
					type: 'error',
					msg: 'Error: ' + error,
				});
			}
		}
	}
	// const response = await axios.post(url, postInputs);

	return (
		<Form>
			<form className=" flex flex-col" onSubmit={(e) => handleSubmit(e)}>
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
					className="mt-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 disabled:bg-slate-600 highlight-white/20 hover:bg-sky-400 disabled:cursor-wait"
					type="submit"
					disabled={loading}
				>
					{loading ? <Loader /> : 'Login'}
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
