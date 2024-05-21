export function useThrottle(callBack: (...args: []) => void, delay: number = 250) {
	let isPaused: boolean = false;

	return (...args: []) => {
		if (isPaused) return;

		callBack(...args);
		isPaused = true;

		setTimeout(() => {
			isPaused = false;
		}, delay);
	};
}
