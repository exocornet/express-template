import { CounterControl } from '../../shared/ui/Counter/Counter';
import { GetCartStateManager } from '../../shared/ui/CartStateManager/CartStateManager';

export class CartItemControl {
	block: HTMLElement;
	productId: string | null;
	itemCartCounter: HTMLElement | null;
	counter: CounterControl | null;
	deleteButton: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.deleteButton = this.block.querySelector(`${blockClass}__button-empty`);
		this.itemCartCounter = this.block.querySelector(`${blockClass}__count`);
		this.productId = this.itemCartCounter && this.itemCartCounter.getAttribute('data-card-id');
		this.counter = this.itemCartCounter && new CounterControl(this.itemCartCounter, '.counter-cart', this.productId);

		this.#init();
	}

	#init() {
		this.#bindDeleteButton();
	}

	#bindDeleteButton() {
		this.deleteButton?.addEventListener('click', () => {
			this.productId && GetCartStateManager().updateProduct({ productId: this.productId, productCount: 0 });
			//this.block.remove();
		});
	}
}

export function CartItem(block: HTMLElement) {
	const blockClass = '.cart-item';
	const ItemCartArr: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);
	const CART_ITEMS: CartItemControl[] = [];
	ItemCartArr.forEach((itemCart) => {
		CART_ITEMS.push(new CartItemControl(itemCart, blockClass));
	});

	return CART_ITEMS;
}
