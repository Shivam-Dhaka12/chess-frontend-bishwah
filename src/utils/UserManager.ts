interface IUser {
	username: string;
	wins: number;
	losses: number;
	draws: number;
}

class UserManager {
	static get(): IUser {
		const user: string | undefined | null =
			localStorage.getItem('__userdata');

		if (user !== undefined && user !== 'undefined' && user !== null) {
			const data = JSON.parse(user);
			return data;
		}
		return {
			username: 'Test_User',
			wins: 0,
			losses: 0,
			draws: 0,
		};
	}

	static set(val: IUser): void {
		localStorage.setItem('__userdata', JSON.stringify(val));
	}

	static remove(): void {
		localStorage.removeItem('__userdata');
		console.log('User data removed');
	}

	static clear(): void {
		localStorage.clear();
	}
}

export default UserManager;
