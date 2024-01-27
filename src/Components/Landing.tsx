import { useNavigate } from 'react-router-dom';

export default function Landing() {
	const navigate = useNavigate();

	return (
		<>
			<button onClick={() => navigate('/login')}>LOGIN</button>
			<button onClick={() => navigate('/signup')}>REGISTER</button>
		</>
	);
}
