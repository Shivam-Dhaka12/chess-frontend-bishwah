import { useSetRecoilState } from 'recoil';
import { alertState, TAlert } from './../recoil/atoms/Alert';
import { useRef } from 'react';

export default function useShowAlert() {
	const setAlert = useSetRecoilState(alertState);
	const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	return ({ type, msg }: TAlert) => {
		// Clear the previous alert timeout, if any
		if (alertTimeoutRef.current) {
			clearTimeout(alertTimeoutRef.current);
		}
		// Set the new alert
		setAlert({
			show: true,
			type,
			msg,
		});

		// Set a new timeout for hiding the alert after 5 seconds
		alertTimeoutRef.current = setTimeout(() => {
			setAlert({
				show: false,
				type: '',
				msg: '',
			});
			// Clear the reference after hiding the alert
			alertTimeoutRef.current = null;
		}, 5000);
	};
}
