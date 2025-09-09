function NotFoundPage() {
	return (
		<div className="flex flex-col justify-center items-center w-screen h-screen bg-beige select-none">
			<div className="text-green text-7xl md:text-9xl font-bold">404</div>
			<div className="text-green text-3xl md:text-5xl font-normal">Page Not Found</div>
			<div className="text-lightgreen text-sm md:text-3xl font-extralight mt-2 md:mt-8">Sorry, the page you are looking for does not exist.</div>
		</div>
	);
}

export default NotFoundPage;