export function useDebounce<T>(callBack: (...args: T[]) => void, delay: number = 250) {
	let timeout: NodeJS.Timeout | undefined = undefined;

	return (...args: T[]) => {
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			callBack(...args);
		}, delay);
	};
}

export class ClassDebounce<T> {
	private timeout: NodeJS.Timeout | undefined = undefined;

	constructor(private readonly callBack: (...args: T[]) => void, private readonly delay: number = 250) {}

	clearTimer() {
		clearTimeout(this.timeout);
	}

	setTimer(...args: T[]) {
		this.clearTimer();

		this.timeout = setTimeout(() => {
			this.callBack(...args);
		}, this.delay);
	}
}
