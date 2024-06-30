import { Socket, io } from 'socket.io-client';
import { TAlert } from './../recoil/atoms/Alert';
import { NavigateFunction } from 'react-router-dom';
// Singleton pattern implementation
let socketInstance: Socket | null = null;

const getSocketInstance = (jwt: string) => {
	if (!socketInstance) {
		if (!jwt) {
			console.log('jwt not provided');
			return;
		}
		//create new instance with server
		socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 5,
			auth: {
				token: jwt,
			},
		});

		console.log('socket created');
	}
	return socketInstance;
};

const deleteSocketInstance = () => {
	socketInstance = null;
};

const handleSocketError = (
	socket: Socket,
	showAlert: ({ type, msg }: TAlert) => void,
	navigate?: NavigateFunction,
	navigateTo?: string
) => {
	socket.on('error', (error: { message: string; navigateURL: string }) => {
		// Display an alert with the error message
		showAlert({
			show: true,
			type: 'error',
			msg: 'Error: ' + error.message,
		});

		if (navigate && error.navigateURL) {
			// Redirect the user to the navigateTo page
			console.log('inside navigate');
			navigateTo = navigateTo || '/';
			navigate(error.navigateURL);
		}
	});

	socket.on('reconnect-error', (error: { message: string }) => {
		// Display an alert with the error message
		console.log('inside reconnect error frontend');
		showAlert({
			show: true,
			type: 'error',
			msg: 'Error: ' + error.message,
		});

		if (navigate) {
			// Redirect the user to the navigateTo page
			console.log('inside navigate');
			navigateTo = navigateTo || '/';
			navigate(navigateTo);
		}
	});
};

export { getSocketInstance, deleteSocketInstance, handleSocketError };
