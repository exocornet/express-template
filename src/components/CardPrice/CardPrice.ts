import { CounterControl } from '../../shared/ui/Counter/Counter';
import { GetCartStateManager } from '../../shared/ui/CartStateManager/CartStateManager';

class CardPriceControl {
	block: HTMLElement;
	elementFooter: HTMLElement | null;
	elementFooterButton: HTMLElement | null;
	elementButtonPlus: HTMLElement | null;
	elementInput: HTMLElement | null;
	elementButtonMinus: HTMLElement | null;
	elementAddButton: HTMLElement | null;
	counter: CounterControl | null;
	productId: string | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.elementAddButton = this.block.querySelector(`${blockClass}__add-button`);
		this.elementFooter = this.block.querySelector(`${blockClass}__footer`);
		this.elementFooterButton = this.block.querySelector(`${blockClass}__footer-button`);
		this.elementButtonPlus = this.block.querySelector(`${blockClass}__button-plus`);
		this.elementButtonMinus = this.block.querySelector(`${blockClass}__button-minus`);

		this.productId = this.elementFooter && this.elementFooter.getAttribute('data-card-id');
		this.counter =
			this.elementFooterButton &&
			this.elementAddButton &&
			new CounterControl(this.elementFooterButton, blockClass, this.productId, this.elementAddButton);

		this.counter && GetCartStateManager().subscribe(this, this.block, this.#handler);

		// вызов метода инициализации класса
		this.#init();
	}

	#handler = (product: ProductType) => {
		if (this.counter && this.counter.productId === product.productId) {
			if (product.productCount !== 0) {
				this.counter.setValue(product.productCount);
			}
		}
	};

	#init() {
		this.counter?.block.classList.add('d-none');
		this.#bindButtons();
	}

	#bindButtons() {
		this.elementAddButton?.addEventListener('click', () => {
			this.elementAddButton?.classList.add('d-none');
			this.counter?.block.classList.remove('d-none');
		});
		this.elementButtonMinus?.addEventListener('click', () => {
			if (this.counter) {
				const counterMinValue: number = this.counter.elementItemMinValue;
				const counterCountNow: number = this.counter.elementLastCount;

				if (counterCountNow === counterMinValue) {
					this.counter.block.classList.add('d-none');
					this.elementAddButton?.classList.remove('d-none');
				}
			}
		});
	}
}

export function CardPrice(block: HTMLElement) {
	const blockClass: string = '.card-price';
	const elements: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		element && new CardPriceControl(element, blockClass);
	});
}
