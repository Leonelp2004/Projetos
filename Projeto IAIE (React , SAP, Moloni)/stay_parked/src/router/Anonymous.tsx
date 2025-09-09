import { Navigate, Outlet, useLocation } from 'react-router-dom';

function NotLogged({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	
	const hasAccessToken = localStorage.getItem('access_token') !== null;
	const hasRefreshToken = localStorage.getItem('refresh_token') !== null;
	const isLoggedIn = hasAccessToken && hasRefreshToken;

	return !isLoggedIn ? (
		<>{children}</>
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
}

function Anonymous() {
	return (
		<NotLogged>
			<Outlet />
		</NotLogged>
	);
}

export default Anonymous;