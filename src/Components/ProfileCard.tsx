import { useState } from 'react';
import TokenManager from '../utils/tokenManager';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/Auth';
import useShowAlert from '../hooks/useShowAlert';
import { userState } from '../recoil/atoms/User';
import { useRequest } from '../hooks/useRequest';
import Loader from './Loader';
import { deleteSocketInstance } from '../utils/socketManager';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard() {
	const [isOpen, setIsOpen] = useState(false);
	const setAuthState = useSetRecoilState(authState);
	const showAlert = useShowAlert();
	const user = useRecoilValue(userState);
	const { sendRequest, loading } = useRequest();

	const navigate = useNavigate();

	async function handleLogout() {
		setIsOpen(false);
		const token = TokenManager.get();
		const headers = {
			'Content-Type': 'application/json',
			token, // Include the token in the Authorization header
		};
		if (token) {
			const response = await sendRequest(
				'/api/protected/logout',
				'null',
				{},
				'Logout Successful!',
				headers
			);

			if (!response?.data.success) {
				showAlert({
					show: true,
					type: 'error',
					msg:
						'Error: ' + response?.data.message ||
						'Something went wrong',
				});
			}
			TokenManager.remove();
			setAuthState('');
			deleteSocketInstance();

			console.log(navigate('/landing'));
		}
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
						<img
							alt="profile image"
							src="/profile_image.png"
							className="rounded-full mx-auto absolute w-18 -top-6 sm:-top-10 sm:w-24 left-1/2 -translate-x-1/2"
						/>
						<div className="font-semibold text-slate-50 text-sm  mt-2 text-center">
							{user.username}
						</div>
						<div className="mt-8 max-w-64 text-center  mx-auto  border-white border shadow-sm p-4 rounded-lg flex justify-around text-slate-100 text-2xl">
							<div>
								23
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									wins
								</div>
							</div>
							<div>
								23
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									wins
								</div>
							</div>
							<div>
								23
								<div className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									wins
								</div>
							</div>
						</div>
						<div className="border-red-500 text-sm font-medium max-w-64 mx-auto p-4 mt-4 text-slate-200">
							<p>
								<span className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									Email:
								</span>{' '}
								{user.username}
							</p>
							<p>
								<span className="my-2 text-center max-w-3xl mx-auto   cursor-pointer font-mono font-medium  text-sky-400 text-sm">
									UserId:
								</span>{' '}
								shivam12dhaka@!1852
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
					<img
						alt="profile image"
						className="cursor-pointer rounded-full "
						src="/profile_image.png"
						width={35}
						onClick={() => setIsOpen(true)}
					/>
				</div>
			)}
		</div>
	);
}
