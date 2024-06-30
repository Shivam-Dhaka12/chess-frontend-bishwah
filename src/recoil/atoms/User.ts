import { atom } from 'recoil';
import UserManager from './../../utils/UserManager';

export const userState = atom({
	key: 'user',
	default: {
		username: UserManager.get().username,
		wins: UserManager.get().wins,
		losses: UserManager.get().losses,
		draws: UserManager.get().draws,
	},
});
