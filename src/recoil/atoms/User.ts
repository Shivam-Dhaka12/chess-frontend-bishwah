import { atom } from 'recoil';

export const userState = atom({
	key: 'user',
	default: { username: 'test_user' },
});
