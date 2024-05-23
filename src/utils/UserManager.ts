class UserManager {
	static get(): string {
		const user: string | undefined | null =
			localStorage.getItem('__userdata');

		if (user !== undefined && user !== 'undefined' && user !== null) {
			const data = JSON.parse(user);
			return data;
		}
		return 'Test_User';
	}

	static set(val: string): void {
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
