import { atom } from 'recoil';
import TokenManager from '../../utils/tokenManager';

export const authState = atom({
	key: 'auth',
	default: TokenManager.get(),
});
