import { Loader } from 'lucide-react';

function LoadingPage() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen bg-beige select-none">
			<Loader className="w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24 text-green animate-spin" />
		</div>
	);
}

export default LoadingPage;