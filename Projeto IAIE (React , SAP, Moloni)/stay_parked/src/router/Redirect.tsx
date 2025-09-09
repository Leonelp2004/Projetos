import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

enum RedirectTo {
  Login = '/login',
  Homepage = '/homepage',
}

const RedirectConditions = ({children}: {children: React.ReactNode}) => {
  const location = useLocation();
  const hasAccessToken = localStorage.getItem('access_token') !== null;
	const hasRefreshToken = localStorage.getItem('refresh_token') !== null;
	const isLoggedIn = hasAccessToken && hasRefreshToken;
  const [redirectTo, setRedirectTo] = useState<RedirectTo | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setRedirectTo(RedirectTo.Login);
    } else {
      setRedirectTo(RedirectTo.Homepage);
    }
  }, [isLoggedIn]);

  if (redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

function Redirect() {
  return (
    <RedirectConditions>
      <Outlet />
    </RedirectConditions>
  )
}

export default Redirect;