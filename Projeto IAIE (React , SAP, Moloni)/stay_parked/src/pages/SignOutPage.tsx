import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignOutPage() { 
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');

		navigate('/');
	};

	useEffect(() => {
		handleSignOut();
	}, []);

	return null;
}

export default SignOutPage;