import { useRecoilValue } from 'recoil';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';
import { alertState } from '../recoil/atoms/Alert';
import { authState } from '../recoil/atoms/Auth';
import Alert from './Alert';

export default function Wrapper({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const alert = useRecoilValue(alertState);
	const authToken = useRecoilValue(authState).token;
	let isLoggedIn = true;
	if (!authToken || authToken === 'Invalid_Token') isLoggedIn = false;

	return (
		<div className="bg-gradient-to-b from-slate-950 to-slate-800 min-h-screen flex flex-col  pt-4 sm:pt-6 px-6 md:px-8 scroll-auto text-slate-50">
			{/*navbar*/}
			<div className="flex justify-between items-center">
				<div
					onClick={() => navigate('/')}
					className=" cursor-pointer relative flex justify-items-start items-baseline font-bold tracking-tight text-lg leading-6"
				>
					<img src="/chess.png" width={40} />
					<span className="text-slate-50 text-3xl pl-2">che</span>
					<span className="text-sky-500 text-3xl">ss</span>
				</div>
				{isLoggedIn && <ProfileCard />}
				{alert.show && <Alert />}
			</div>
			{/*main content*/}
			<div className="flex-grow flex items-center justify-center">
				{children}
			</div>
			<div className="w-full h-10"></div>
		</div>
	);
}
