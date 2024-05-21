import { CardProductCounter, CardProductCounterControl } from '../../shared/ui/Counter/Counter';

class BannerPromoTimer {
	block: HTMLElement;
	bannerTime: HTMLElement | null;
	bannerTimeEnd: string | null;
	elementWrapper: NodeListOf<HTMLElement> | null;
	cardProductCounter: CardProductCounterControl | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.bannerTime = this.block.querySelector(`${blockClass}__time`);
		this.bannerTimeEnd = this.bannerTime && this.bannerTime.getAttribute('data-time-until-end');
		this.elementWrapper = this.bannerTime && this.bannerTime.querySelectorAll(`${blockClass}__time-block`);

		const productId = this.block.getAttribute('data-card-id');
		this.cardProductCounter = CardProductCounter(this.block, productId);

		// вызов метода инициализации класса
		this.#init();
	}

	#init() {
		const inspire: string = this.bannerTimeEnd || ''; // Время окончания акции в формате Date()
		const inspireDate = new Date(inspire).getTime(); // Перевод времени в миллисекунды

		const interval = setInterval(() => {
			const arr = calculateTimeToPromoEnd();

			this.elementWrapper?.forEach((item, index) => {
				const timeBlock = item.querySelector('.banner-promo__time-block-value') as HTMLElement;
				timeBlock.textContent = String(arr[index]);
			});
		}, 1000);

		const calculateTimeToPromoEnd = (): number[] => {
			const arr: number[] = [];
			const diff = Math.round((inspireDate - Date.now()) / 1000);
			if (diff < 1) {
				clearInterval(interval);
				return [0, 0, 0, 0];
			}
			const days = Math.trunc(diff / 60 / 60 / 24);
			const hours = Math.trunc((diff / 60 / 60) % 24);
			const minutes = Math.trunc((diff / 60) % 60);
			const seconds = diff % 60 || 0;
			arr.push(days, hours, minutes, seconds);

			return arr;
		};
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.banner-promo';
	const element: HTMLElement | null = document.querySelector(`${blockClass}`);
	element && new BannerPromoTimer(element, blockClass);
});
