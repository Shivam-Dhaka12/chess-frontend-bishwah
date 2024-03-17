import { useRecoilValue } from 'recoil';
import Router from './Routes/index';
import './App.css';
import { authState } from './recoil/atoms/Auth';

function App() {
	const authToken = useRecoilValue(authState);
	const isLoggedIn = authToken ? true : false;

	return <Router isLoggedIn={isLoggedIn} />;
}

export default App;
