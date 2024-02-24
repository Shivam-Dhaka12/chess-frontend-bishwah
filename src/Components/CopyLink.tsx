import { useState } from 'react';

export default function CopyLink({ link }: { link: string }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="text-white font-bold">
			{isOpen && (
				<div className="backdrop-blur-xl h-full w-full fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center transition-opacity ">
					<div className="bg-slate-900 mx-auto rounded-lg relative   pt-12 px-8 pb-8 sm:py-14 sm:px-24 shadow-sm min-w-72 sm:min-w-3xl">
						<img
							src="/cross.png"
							alt="close button"
							className="w-4 h-4 cursor-pointer absolute top-4 right-4 hover:scale-110 "
							onClick={() => setIsOpen(false)}
						/>

						<div className="flex items-center ">
							<input
								type="text"
								className="sm:flex items-center justify-center  w-full p-2  ring-slate-900/10 hover:ring-slate-300 focus:outline-none  focus:ring-sky-500 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-900 tracking-wide font-semibold border-slate-500 border px-4"
								value={link}
							/>
							<img
								src="/copy.png"
								alt="copy button"
								className="w-8 h-8 cursor-pointer  hover:scale-110 "
							/>
						</div>

						<div className="flex items-center justify-center">
							<button className="sm:flex items-center justify-center px-4 p-2 mt-4 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg  bg-slate-800 ring-0 text-slate-300 highlight-white/5 hover:bg-slate-700 tracking-wide font-semibold ">
								Room ID: {53467}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
