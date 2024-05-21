import { CardProductCounter, CardProductCounterControl } from '../../shared/ui/Counter/Counter';

export class CardProductControl {
	block: HTMLElement;
	elementFooter: HTMLElement | null;
	elementFooterButton: HTMLElement | null;
	elementButtonPlus: HTMLElement | null;
	elementInput: HTMLElement | null;
	elementButtonMinus: HTMLElement | null;
	cardProductCounter: CardProductCounterControl | null;
	productId: string | null;
	blockClass: string;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.blockClass = blockClass;

		this.productId = this.block.getAttribute('data-card-id');
		this.cardProductCounter = CardProductCounter(this.block, this.productId);

		this.#init();
	}

	#init() {
		this.block.addEventListener('click', (e) => {
			e.preventDefault();
		});
	}
}

export function CardProduct(block: HTMLElement) {
	const blockClass: string = '.card-product';
	const elements: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		new CardProductControl(element, blockClass);
	});
}

export function InitNewCardProduct(newElements: NodeListOf<HTMLElement>) {
	const blockClass: string = '.card-product';
	newElements.forEach((newElement) => {
		const element: HTMLElement | null = newElement.querySelector(blockClass);
		element && new CardProductControl(element, blockClass);
	});

	return newElements;
}
