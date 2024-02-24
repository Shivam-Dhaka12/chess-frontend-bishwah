import axios from 'axios';
import { loginUrl, registerUrl } from '../react-query/endpoints';

export type AuthCred = {
	username: string;
	password: string;
};

export type AuthSuccessResponse = {
	message: string;
	success: boolean;
	token: string;
};

export type AuthErrResponse = Omit<AuthSuccessResponse, 'token'>;
export type RegisterResponse = Omit<AuthSuccessResponse, 'token'>;

const login = async ({
	username,
	password,
}: AuthCred): Promise<AuthSuccessResponse> => {
	try {
		const response = await axios.post<AuthSuccessResponse>(loginUrl, {
			username,
			password,
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('Axios error:', error.response?.data);
		} else {
			console.error('Server error:', error);
		}
		throw error;
	}
};

const register = async (registerCred: AuthCred): Promise<RegisterResponse> => {
	try {
		const response = await axios.post(registerUrl, registerCred);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log(error.response?.data);
		}
		throw error;
	}
};

const authService = {
	login,
	register,
};
export default authService;
