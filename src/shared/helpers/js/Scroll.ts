import { SmoothScrollControl } from './SmoothScroll';
import { useMediaQuery } from './useMediaQuery';

export class Scroll {
	mediaQuery: number;
	constructor(mediaQuery: number) {
		this.mediaQuery = mediaQuery;
		this.#init();
	}

	#init() {
		this.#SmoothScroll();
		useMediaQuery(this.mediaQuery, this.#setScrollbarWidth, this.#setScrollbarWidth);
	}

	#SmoothScroll() {
		SmoothScrollControl();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		SmoothScroll({
			// Время скролла 400 = 0.4 секунды
			animationTime: 150,
			// Размер шага в пикселях
			stepSize: 75,

			// Дополнительные настройки:

			// Ускорение
			accelerationDelta: 30,
			// Максимальное ускорение
			accelerationMax: 2,
			// Поддержка клавиатуры
			keyboardSupport: true,
			// Шаг скролла стрелками на клавиатуре в пикселях
			arrowScroll: 50,

			// Pulse (less tweakable)
			// ratio of "tail" to "acceleration"
			pulseAlgorithm: true,
			pulseScale: 4,
			pulseNormalize: 1,

			// Поддержка тачпада
			touchpadSupport: true,
		});
	}

	#setScrollbarWidth() {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty('--js-scrollbar-width', `${scrollbarWidth}px`);
	}
}
