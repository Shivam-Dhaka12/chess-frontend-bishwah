import { useRecoilValue } from 'recoil';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';
import { alertState } from '../recoil/atoms/Alert';
import Alert from './Alert';
import { authSelector } from '../recoil/selectors/authSelector';

export default function Main({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const alert = useRecoilValue(alertState);
	const authToken = useRecoilValue(authSelector);
	const isLoggedIn = authToken ? true : false;

	return (
		<div className="relative bg-gradient-to-b from-slate-950 to-slate-800 min-h-full pt-4 sm:pt-6 px-6 md:px-8 scroll-auto ">
			<div className="flex justify-between items-center">
				<div
					onClick={() => navigate('/')}
					className="cursor-pointer relative pt-2 sm:pt-4 flex justify-items-start items-baseline font-bold tracking-tight text-lg leading-6"
				>
					<img src="/chess.png" width={40} />
					<span className="text-slate-50 text-3xl pl-2">che</span>
					<span className="text-sky-500 text-3xl">ss</span>
				</div>
				{isLoggedIn && <ProfileCard />}
				{alert.show && <Alert />}
			</div>
			{children}
		</div>
	);
}
