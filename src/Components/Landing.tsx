import { useState } from 'react';

interface FormProps {
	onSetForm: (form: string) => void;
}

export default function Landing() {
	const [form, setForm] = useState('login');
	console.log(form);

	function handleSetForm(form: string) {
		if (form === 'login' || form === 'signup') setForm(form);
	}

	return (
		<>
			<div className=" overflow-auto font-sans bg-slate-950 min-h-screen  p-15">
				<div className="pt-14 px-10 mx-auto block text-center">
					<h1 className=" text-gray-50 text-6xl font-bold uppercase my-5 drop-shadow-lg">
						Chess
					</h1>
					<p className=" text-gray-50 text-lg">
						Play with your friends online 🐴
					</p>
				</div>
				{form === 'login' && <Login onSetForm={handleSetForm} />}
				{form === 'signup' && <Signup onSetForm={handleSetForm} />}
			</div>
		</>
	);
}

function Login({ onSetForm }: FormProps) {
	return (
		<form className=" flex flex-col m-10 px-5 py-12 rounded-xl max-w-72 mx-auto">
			<input
				type="email"
				placeholder="Email"
				className="mb-4 py-2 bg-slate-950 border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors
					"
			/>
			<input
				type="password"
				placeholder="Password"
				className="mb-4 py-2 bg-slate-950 border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors"
			/>

			<button className="blocktext-slate-900 p-2 mt-8 text-md rounded-sm cursor-pointer bg-slate-100 hover:bg-white transition-colors">
				Login
			</button>

			<p className="my-2 mx-auto text-gray-200 text-sm">
				Doesn't have an account?{' '}
				<span
					onClick={() => onSetForm('signup')}
					className="underline cursor-pointer hover:text-gray-50"
				>
					Sign up
				</span>
			</p>
		</form>
	);
}

function Signup({ onSetForm }: FormProps) {
	return (
		<>
			<form className=" flex flex-col m-10 px-5 py-12 rounded-xl max-w-72 mx-auto">
				<input
					type="email"
					placeholder="Email"
					className="mb-4 py-2 bg-slate-950 border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors
					"
				/>
				<input
					type="password"
					placeholder="Password"
					className="mb-4 py-2 bg-slate-950 border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors"
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					className="mb-4 py-2 bg-slate-950 border-b-2 border-b-gray-200 text-gray-50 outline-none
					hover:border-b-gray-50 transition-colors"
				/>

				<button className="blocktext-slate-900 p-2 mt-8 text-md rounded-sm cursor-pointer bg-slate-100 hover:bg-white transition-colors">
					Sign Up
				</button>

				<p className="my-2 mx-auto text-gray-200 text-sm">
					Already have an account?{' '}
					<span
						onClick={() => onSetForm('login')}
						className="underline cursor-pointer hover:text-gray-50"
					>
						Login
					</span>
				</p>
			</form>
		</>
	);
}