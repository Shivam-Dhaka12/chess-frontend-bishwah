import { Socket, io } from 'socket.io-client';
import { TAlert } from '../recoil/atoms/Alert';
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
			auth: {
				token: jwt,
			},
		});
	}
	return socketInstance;
};

const deleteSocketInstance = () => {
	socketInstance = null;
};

const handleSocketError = (
	socket: Socket,
	showAlert: ({ type, msg }: TAlert) => void
) => {
	socket.on('error', (error: { message: string }) => {
		// Display an alert with the error message
		showAlert({
			show: true,
			type: 'error',
			msg: 'Error: ' + error.message,
		});
	});
};

export { getSocketInstance, deleteSocketInstance, handleSocketError };
