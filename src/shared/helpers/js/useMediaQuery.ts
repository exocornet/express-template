export function useMediaQuery(media: number, callbackMobile: () => void, callbackDesktop: () => void) {
	const mediaQuery = window.matchMedia(`(max-width: ${media - 1}px)`);

	mediaQuery.addEventListener('change', (ev: MediaQueryListEvent) => {
		const mq = ev.currentTarget as MediaQueryList;
		if (mq.matches) {
			callbackMobile();
		} else {
			callbackDesktop();
		}
	});

	if (mediaQuery.matches) {
		callbackMobile();
	} else {
		callbackDesktop();
	}
}
