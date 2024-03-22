class TokenManager {
	static get(): string {
		const tkn: string | undefined | null = localStorage.getItem('__ustkn');

		if (tkn !== undefined && tkn !== 'undefined' && tkn !== null) {
			const data = JSON.parse(tkn);
			return data;
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
