import Loader from './Loader';
import TokenManager from './../utils/TokenManager';
import useShowAlert from './../hooks/useShowAlert';
import { useState } from 'react';
import { authState } from './../recoil/atoms/Auth';
import { userState } from './../recoil/atoms/User';
import { useRequest } from './../hooks/useRequest';
import { useNavigate } from 'react-router-dom';
import { deleteSocketInstance } from './../utils/socketManager';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import UserManager from './../utils/UserManager';

export default function ProfileCard() {
	const [isOpen, setIsOpen] = useState(false);
	const setAuthState = useSetRecoilState(authState);
	const setUserState = useSetRecoilState(userState);
	const showAlert = useShowAlert();
	const user = useRecoilValue(userState);
	const token = useRecoilValue(authState).token;
	const { sendRequest, loading } = useRequest();
	const navigate = useNavigate();
	console.log('HUHU USEER', user);

	const { username, wins, losses, draws } = user;
	const initials = username
		.split(' ')
		.map((name) => name.charAt(0).toUpperCase())
		.join('');

	async function handleLogout() {
		setIsOpen(false);

		const url = '/api/protected/logout';
		const postInputs = {};
		const onSuccessUrl = '/';
		const successMsg = 'Logout Successful!';

		if (!token || token === 'Invalid_Token') {
			showAlert({
				show: true,
				type: 'secondary',
				msg: 'Already Logged out',
			});

			TokenManager.remove();
			setAuthState({
				token: '',
			});

			navigate(onSuccessUrl);
			return;
		}

		const headers = {
			'Content-Type': 'application/json',
			token, // Include the token in the Authorization header
		};

		await sendRequest(url, postInputs, successMsg, headers);

		TokenManager.remove();
		setAuthState({
			token: '',
		});
		UserManager.remove();
		setUserState({
			username: 'Test_User',
			wins: 0,
			losses: 0,
			draws: 0,
		});
		deleteSocketInstance();
		showAlert({
			show: true,
			type: 'primary',
			msg: successMsg,
		});
		navigate(onSuccessUrl);
	}

	return (
		<div className="text-white font-bold">
			{isOpen ? (
				<div className="backdrop-blur-xl h-full w-full fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center transition-opacity ">
					<div className="bg-slate-900 mx-auto rounded-lg relative   py-12 px-8 sm:py-14 sm:px-24 shadow-sm">
						<img
							src="/cross.png"
							alt="close button"
							className="w-4 h-4 cursor-pointer absolute top-4 right-4 hover:scale-110 "
							onClick={() => setIsOpen(false)}
						/>
						<div className="flex justify-center">
							<div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full mx-auto">
								<span className="font-medium text-gray-600">
									{initials}
								</span>
							</div>
						</div>

						<div className="font-semibold text-slate-50 text-sm  mt-2 text-center">
							{username}
						</div>
						<div className="mt-8 max-w-64 text-center  mx-auto  border-white border shadow-sm p-4 rounded-lg flex justify-around text-slate-100 text-2xl">
							<div>
								{wins}
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									Wins
								</div>
							</div>
							<div>
								{losses}
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									Losses
								</div>
							</div>
							<div>
								{draws}
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									Draws
								</div>
							</div>
						</div>
						{/* <div className=" font-light text-sm max-w-64 my-4">
						</div> */}
						<div className="text-sm font-light max-w-64 mx-auto p-4 mt-4 text-slate-200 text-center">
							<p>
								{/* <span className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									Email:
								</span>{' '} */}
								These stats will only be updated on your next
								login :)
							</p>
						</div>
						<div>
							<button
								onClick={() => handleLogout()}
								className="sm:flex items-center justify-center  w-full py-4 mt-4 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-700 tracking-wide font-semibold"
							>
								{loading ? <Loader /> : 'Logout'}
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="">
					<div
						className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full cursor-pointer"
						onClick={() => setIsOpen(true)}
					>
						<span className="font-medium text-gray-600">
							{initials}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
