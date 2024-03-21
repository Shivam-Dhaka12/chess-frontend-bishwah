import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Game from '../pages/Game';
import Landing from '../pages/Landing';
import JoinRoom from '../pages/Room';
import Wrapper from '../Components/Wrapper';
import PageNotFound from '../pages/PageNotFound';

const Router = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
	return useRoutes([
		{
			path: '/',
			element: (
				<Wrapper>
					<Outlet />
				</Wrapper>
			),
			children: [
				{ path: '', element: <Landing /> },
				{ path: 'login', element: <Signin /> },
				{ path: 'signup', element: <Signup /> },
				{
					path: 'user',
					element: isLoggedIn ? <Outlet /> : <Navigate to="/login" />,
					children: [
						{
							path: 'room',
							element: <JoinRoom />,
						},
						{
							path: 'Game',
							element: <Game />,
						},
					],
				},
				// below are testing routes, without auth
				{ path: 'room', element: <JoinRoom /> },
				{ path: 'game', element: <Game /> },

				{
					path: '*',
					element: <PageNotFound />,
				},
			],
		},
	]);
};

export default Router;
