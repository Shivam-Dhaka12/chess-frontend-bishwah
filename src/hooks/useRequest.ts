import { useState } from 'react';
// import { NavigateFunction } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import useShowAlert from './useShowAlert'; // Assuming you have a custom hook for showing alerts

export function useRequest() {
	const showAlert = useShowAlert();
	const [loading, setLoading] = useState(false);

	const sendRequest = async (
		url: string,
		postInputs: object,
		successMsg: string,
		headers: object = {
			'Content-Type': 'application/json',
		}
	) => {
		setLoading(true);
		const completeUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`;
		try {
			const response = await axios.post(completeUrl, postInputs, {
				headers,
			});

			showAlert({
				show: true,
				type: 'primary',
				msg: successMsg,
			});

			return response;
		} catch (error) {
			console.log(error);
			let errorMsg = error.message;
			if (isAxiosError(error) && error.response) {
				errorMsg = error.response.data.message;
			}
			showAlert({
				show: true,
				type: 'error',
				msg: errorMsg,
			});
		} finally {
			setLoading(false);
		}
	};

	return { sendRequest, loading };
}
