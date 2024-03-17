import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/Auth';

export default function Landing() {
	const navigate = useNavigate();
	const authToken = useRecoilValue(authState);
	const isLoggedIn = authToken ? true : false;

	return (
		<>
			<div className="relative max-w-5xl mx-auto pt-6 lg:pt-12 flex flex-col items-center ">
				<h1 className=" font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-tight text-center text-white mt-10">
					Play Chess online with your buddies.
				</h1>
				<p className="mt-6 text-sm lg:text-lg  text-center max-w-64 lg:max-w-3xl mx-auto text-slate-400">
					Build with the power of{' '}
					<code className="font-mono font-medium text-sky-400">
						React
					</code>{' '}
					and{' '}
					<code className="font-mono font-medium text-sky-400">
						Scoket.io
					</code>
				</p>
				{isLoggedIn ? (
					<div className="mt-10 flex justify-center space-x-6 text-sm sm:text-md ">
						<a
							onClick={() => navigate('/user/game')}
							className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
						>
							Start Game
						</a>
					</div>
				) : (
					<div className="mt-10 flex justify-center space-x-6 text-sm sm:text-md ">
						<a
							onClick={() => navigate('/login')}
							className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
						>
							Login
						</a>

						<button
							onClick={() => navigate('/signup')}
							className="sm:flex items-center justify-center sm:w-28  px-4 h-12 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-700 tracking-wide font-semibold"
						>
							Signup
						</button>
					</div>
				)}

				<img
					src="/two_player_icon.png"
					width={300}
					className="max-w-56 mt-10 rounded-lg"
				/>
			</div>
		</>
	);
}
