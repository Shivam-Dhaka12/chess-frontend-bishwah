import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../Components/Form';
import axios, { isAxiosError } from 'axios';
import useShowAlert from '../utils/useShowAlert';

const Signup = () => {
	const navigate = useNavigate();
	const [postInputs, setPostInputs] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});

	const showAlert = useShowAlert();

	async function sendRequest() {
		try {
			const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`;
			await axios.post(url, postInputs);
			navigate('/login');
			showAlert({
				show: true,
				type: 'primary',
				msg: 'Account created successfully',
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
				className="flex flex-col "
				onSubmit={(e) => {
					if (e) {
						e.preventDefault();
					}

					if (postInputs.password !== postInputs.confirmPassword) {
						showAlert({
							show: true,
							type: 'error',
							msg: 'Passwords do not match',
						});
						return;
					}
					sendRequest();
				}}
			>
				<h1 className=" font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center text-white mb-10 md:mb-16">
					S<span className="text-sky-500">i</span>gnUp
				</h1>
				<input
					type="email"
					placeholder="Email"
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
				<input
					type="password"
					placeholder="Confirm Password"
					value={postInputs.confirmPassword}
					onChange={(e) =>
						setPostInputs((c) => ({
							...c,
							confirmPassword: e.target.value,
						}))
					}
					className="px-2 mb-4 py-2 bg-transparent border-b-2 border-b-gray-200 text-gray-50 outline-none
        				hover:border-b-gray-50 transition-colors white-eye"
					required
				/>

				<button
					className="mt-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400 "
					type="submit"
				>
					Sign Up
				</button>

				<p className="mt-6 text-sm  text-center max-w-3xl mx-auto text-slate-400">
					Already have an account?{' '}
					<span
						onClick={() => {
							navigate('/login');
						}}
						className="block underline cursor-pointer font-mono font-medium text-sky-500 "
					>
						Login
					</span>
				</p>
			</form>
		</Form>
	);
};

export default Signup;
