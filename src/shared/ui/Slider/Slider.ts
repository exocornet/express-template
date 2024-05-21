// ПРИ ПОЯВЛЕНИЕ СЛАЙДЕРА ОТЛИЧАЮЩЕГОСЯ ПО ДИЗАЙНУ ОТ ДАННОГО СЛАЙДЕРА ТРЕБУЕТСЯ РАЗДЕЛИТЬ ЛОГИКУ НА РАЗНЫЕ КОМПОНЕНТЫ И ПРОВЕСТИ РЕФАКТОРИНГ
// КОМПОНЕНТ +Slider ОСТАНЕТСЯ И БУДЕТ ВЫЗЫВАТЬСЯ УЖЕ В СООТВЕТСТВУЮЩИЕ КОМПОНЕНТЫ
import Swiper from 'swiper';
import { EffectFade, Pagination, Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

Swiper.use([EffectFade, Pagination, Navigation]);

/** Класс настроек слайдера */
export class SliderControl {
	block: HTMLElement;
	swiper: HTMLElement | null;
	slideArr: NodeListOf<HTMLElement>;
	pagination: HTMLElement | null;
	buttonPrev: HTMLElement | null;
	buttonNext: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.swiper = this.block.querySelector(`${blockClass}__swiper`);
		this.slideArr = this.block.querySelectorAll(`${blockClass}__slide`);
		this.pagination = this.block.querySelector(`${blockClass}__pagination`);
		this.buttonPrev = this.block.querySelector(`${blockClass}__prev`);
		this.buttonNext = this.block.querySelector(`${blockClass}__next`);

		/** Инициализация слайдера */
		if (this.swiper) {
			new Swiper(this.swiper, this.#optionsSlider());
		}
	}

	/** определение настроек слайдера */
	#optionsSlider(): SwiperOptions {
		return {
			spaceBetween: 20,
			slidesPerView: 1,
			speed: 400,
			pagination: {
				el: this.pagination,
				clickable: true,
			},
			navigation: {
				prevEl: this.buttonPrev,
				nextEl: this.buttonNext,
			},
		} as SwiperOptions;
	}
}

export function Slider(block?: HTMLElement, el?: string): void {
	const BLOCK_CLASS: string = el || '.slider';
	const ELEMS: NodeListOf<HTMLElement> = block
		? block.querySelectorAll(BLOCK_CLASS)
		: document.querySelectorAll(BLOCK_CLASS);

	ELEMS.forEach((elem): void => {
		elem && new SliderControl(elem, BLOCK_CLASS);
	});
}
