import { atom } from 'recoil';
import UserManager from '../../utils/UserManager';

export const userState = atom({
	key: 'user',
	default: { username: UserManager.get() },
});
