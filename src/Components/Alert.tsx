import { useRecoilState } from 'recoil';
import { alertState } from './../recoil/atoms/Alert';

const alertTypeClasses: Record<string, string> = {
	error: 'bg-pink-700 hover:bg-pink-600 ',
	primary: 'bg-sky-700 hover:bg-sky-600 ',
	secondary: 'bg-slate-800 hover:bg-slate-700 ',
};

export default function Alert() {
	const [{ type, msg }, setAlert] = useRecoilState(alertState);

	return (
		<div
			className={`${alertTypeClasses[type]}flex items-center alert md:alert  absolute top-8 left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:top-10 md:right-10  text-white alert-error pl-6 pr-10 md:pl-8 md:pr-12 py-4 md:py-6 shadow-md highlight-white/20  cursor-pointer rounded-r-md rounded-tl-md min-w-max z-30 md:z-30 lg:`}
		>
			{msg}

			<img
				src="/cross.png"
				className="absolute right-4 rounded-full  scale-100 hover:scale-110"
				width={15}
				onClick={() => setAlert({ show: false, type: '', msg: '' })}
			/>
		</div>
	);
}
