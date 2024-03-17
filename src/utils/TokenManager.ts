class TokenManager {
	static get(): string {
		const tkn: string | null = localStorage.getItem('__ustkn');
		if (tkn) {
			return JSON.parse(tkn);
		}
		return '';
	}

	static set(val: string): void {
		localStorage.setItem('__ustkn', JSON.stringify(val));
	}

	static remove(): void {
		localStorage.removeItem('__ustkn');
	}

	static clear(): void {
		localStorage.clear();
	}
}

export default TokenManager;
