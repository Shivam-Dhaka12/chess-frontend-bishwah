import { useState } from 'react';
import useShowAlert from '../hooks/useShowAlert';
export default function CopyLink({
	roomId,
	link,
}: {
	roomId: string;
	link: string;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const showAlert = useShowAlert();
	//
	function copyToClipboard(link: string) {
		navigator.clipboard.writeText(link);
		showAlert({
			show: true,
			type: 'secondary',
			msg: 'Link copied to clipboard',
		});
	}
	return (
		<div className="text-white font-bold">
			{isOpen && (
				<div className="backdrop-blur-lg h-full w-full fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center transition-opacity px-4">
					<div className="bg-slate-800 mx-auto rounded-lg relative md:w-screen  sm:min-w-2xl  max-w-xl pt-12 pb-10 px-4 sm:px-8 border-2  shadow-lg  border-gray-600 flex flex-col justify-center">
						<img
							src="/cross.png"
							alt="close button"
							className="w-4 h-4 cursor-pointer absolute top-4 right-4 hover:scale-110 "
							onClick={() => setIsOpen(false)}
						/>
						<button
							type="button"
							className="font-light absolute top-4 left-6 sm:left-10 text-slate-300 text-sm"
						>
							Room Id: {roomId}
						</button>
						<div className="flex-grow flex flex-col justify-center">
							<div className="font-light text-md my-2 text-slate-300 px-2">
								Copy and share link to invite your friend.
							</div>
							<div className="flex items-center justify-between">
								<input
									type="text"
									className="sm:flex items-center justify-center  w-full p-2  ring-slate-900/10 hover:ring-slate-300 focus:outline-none  focus:ring-sky-500 shadow-sm rounded-lg  bg-slate-900 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-900 tracking-wide font-light border-slate-500 text-center border px-4 flex mr-4"
									readOnly
									value={link}
								/>
								<img
									src="/copy.png"
									alt="copy button"
									className="transform transition-transform w-8 h-8 cursor-pointer hover:scale-110 active:scale-95"
									onClick={() => copyToClipboard(link)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
