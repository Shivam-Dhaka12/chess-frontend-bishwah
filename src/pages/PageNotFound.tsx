export default function PageNotFound() {
	return (
		<div className="relative max-w-5xl mx-auto pt-6 lg:pt-12 flex flex-col items-center ">
			<h1 className=" font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-tight text-center text-white my-28">
				Page not found :)
			</h1>
			<img
				src="/page_not_found.svg"
				alt="page not found"
				className="max-w-72  rounded-lg"
			/>
		</div>
	);
}
