type CustomDialogProps = {
	open: boolean;
	title: string;
	contentText: string;
	handleContinue: () => void;
};

const CustomDialog = ({
	open,
	title,
	contentText,
	handleContinue,
}: CustomDialogProps) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-slate-950 opacity-50 fixed inset-0"></div>
			<div className="p-2 bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg shadow-lg z-50 max-w-lg w-full">
				<div className=" p-4">
					<h2 className="text-slate-100 text-xl font-semibold">
						{title}
					</h2>
				</div>
				<div className="p-4">
					<p className="text-slate-200 text-lg">{contentText}</p>
				</div>
				<div className=" p-4 flex justify-end">
					<a
						onClick={handleContinue}
						className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold focus:ring-offset-2 focus:ring-offset-slate-50 text-white h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
					>
						Continue
					</a>
				</div>
			</div>
		</div>
	);
};

export default CustomDialog;
