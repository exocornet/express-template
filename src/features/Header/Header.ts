import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

class HeaderControl {
	block: HTMLElement;
	main: HTMLElement | null;
	rowHeaderHeight: number | undefined;
	scrollElement: Element | null;
	scrollElemHeight: number;
	marginTop: number;
	paddingBottom: number;
	constructor(block: HTMLElement) {
		this.block = block;
		this.scrollElement = this.block.querySelector('.js-header-scroll');
		this.main = document.querySelector('main');
		this.paddingBottom = parseFloat(window.getComputedStyle(this.block as Element).paddingBottom);
		this.scrollElemHeight = (this.scrollElement as Element).scrollHeight;
		this.marginTop = parseFloat(window.getComputedStyle(this.scrollElement as Element).marginTop);
		this.#init();
	}

	#init() {
		useMediaQuery(768, this.#onChangeMediaQueryForHeader, this.#onChangeMediaQueryForHeader);
		useMediaQuery(1280, this.#onChangeMediaQueryForHeader, this.#onChangeMediaQueryForHeader);
		useMediaQuery(768, this.#onChangeMediaQueryForAsideElems, this.#onChangeMediaQueryForAsideElems);
		useMediaQuery(1280, this.#onChangeMediaQueryForAsideElems, this.#onChangeMediaQueryForAsideElems);
		this.#onWindowScroll();
	}

	#onWindowScroll() {
		const mediaQuery = window.matchMedia(`(max-width: ${1280 - 1}px)`);
		window.addEventListener('scroll', () => {
			if (window.scrollY > this.scrollElemHeight + this.marginTop && mediaQuery.matches) {
				document.documentElement.style.setProperty(
					'--outside-header-height',
					`${this.scrollElemHeight + this.marginTop}px`
				);
			} else {
				document.documentElement.style.setProperty('--outside-header-height', '0px');
			}
		});
	}

	#onChangeMediaQueryForAsideElems = () => {
		const transitionHeader = 400;
		setTimeout(() => {
			this.rowHeaderHeight = this.block.querySelector('.header__row-header')?.scrollHeight;
			document.documentElement.style.setProperty('--outside-indentation', `${this.rowHeaderHeight}px`);
		}, transitionHeader);
	};

	#onChangeMediaQueryForHeader = () => {
		// css transition for header
		const transitionHeader = 400;
		setTimeout(() => {
			this.scrollElemHeight = (this.scrollElement as Element).scrollHeight;
			this.marginTop = parseFloat(window.getComputedStyle(this.scrollElement as Element).marginTop);
			document.documentElement.style.setProperty(
				'--half-of-header-height',
				`-${this.scrollElemHeight + this.marginTop}px`
			);

			this.#onWindowScroll();
		}, transitionHeader);
	};
}

export function Header() {
	const elem: HTMLElement | null = document.querySelector('.header');
	if (elem) {
		new HeaderControl(elem);
	}
}
