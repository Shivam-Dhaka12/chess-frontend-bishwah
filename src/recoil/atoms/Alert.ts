import { atom } from 'recoil';

export type TAlert = {
	show: boolean;
	type: 'error' | 'primary' | 'secondary' | '';
	msg: string;
};

export const alertState = atom<TAlert>({
	key: 'alert',
	default: {
		show: false,
		type: 'error',
		msg: 'This is an sample alert',
	},
});
