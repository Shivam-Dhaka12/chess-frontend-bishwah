import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequest } from './../hooks/useRequest';
import Form from './../Components/Form';
import Loader from './../Components/Loader';
import useShowAlert from './../hooks/useShowAlert';

const Signup = () => {
	const navigate = useNavigate();
	const showAlert = useShowAlert();

	const { sendRequest, loading } = useRequest();

	const [postInputs, setPostInputs] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});

	const url = '/api/auth/signup';
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

		const response = await sendRequest(
			url,
			postInputs,
			'Account created successfully!'
		);

		if (response?.status === 201) {
			navigate('/login');
		}
	}

	return (
		<Form>
			<form className="flex flex-col " onSubmit={(e) => handleSubmit(e)}>
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
					className="mt-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400 disabled:bg-slate-600 disabled:cursor-wait"
					type="submit"
					disabled={loading}
				>
					{loading ? <Loader /> : 'SignUp'}
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
