import { Socket, io } from 'socket.io-client';

// Singleton pattern implementation
let socketInstance: Socket | null = null;

const getSocketInstance = (jwt?: string) => {
	if (!socketInstance) {
		if (!jwt) {
			throw new Error('JWT token not provided');
		}
		socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
			auth: {
				token: jwt,
			},
		});
	}
	return socketInstance;
};

const handleSocketError = (socket: Socket) => {
	socket.on('error', (error: { message: string }) => {
		// Display an alert with the error message
		alert(error.message);
	});
};
export { getSocketInstance, handleSocketError };
