/*
import { CounterControl } from '../../shared/ui/Counter/Counter';
import { GetCartStateManager } from '../../shared/ui/CartStateManager/CartStateManager';

export class CardProductCounterControl extends CounterControl {
	block: HTMLElement;
	productId: string | null;

	constructor(block: HTMLElement, productId: string | null, blockClass: string = '.card-product-counter') {
		super(block, blockClass, productId);

		this.block = block;
		this.productId = productId;

		// вызов метода инициализации класса
		GetCartStateManager().subscribe(this, this.block, this.#handler);

		this.#initCardProductCounter();
	}

	#handler = (product: ProductType) => {
		if (this.productId === product.productId) {
			if (product.productCount !== 0) {
				this.block?.classList.add('js-counter-active');
				super.setValue(product.productCount);
			} else {
				this.block?.classList.remove('js-counter-active');
				super.setValue(product.productCount);
			}
		}
	};

	#initCardProductCounter() {
		this.#bindCardProductButtons();
		this.#bindCardProductInput();
		this.#onClick();
	}

	#onClick() {
		this.block.addEventListener('click', (e) => {
			e.preventDefault();
		});
	}

	#bindCardProductButtons() {
		super.getPlusButton?.addEventListener('click', this.#bindPlus);
		super.getMinusButton?.addEventListener('click', this.#bindMinus);
	}

	#bindCardProductInput() {
		super.getInput?.addEventListener('focusin', () => {
			this.block?.classList.add('js-input-active');

			super.unsetButtonListener();
			this.#bindSecondButtonState();
		});
		super.getInput?.addEventListener('focusout', () => {
			this.block?.classList.remove('js-input-active');
		});
	}

	#confirmInput = () => {
		this.block?.classList.remove('js-input-active');
		this.#unbindSecondButtonState();
	};
	#cancelInput = () => {
		this.block?.classList.remove('js-input-active');
		this.#unbindSecondButtonState();
	};

	#bindPlus = () => {
		this.block?.classList.add('js-counter-active');

		/!*if (this.elementItemCountNow !== this.elementLastCount) {
			this.productId &&
				GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
		}*!/
	};
	#bindMinus = () => {
		if (!this.block?.classList.contains('js-input-active')) {
			if (super.getCount === super.getMinValue - 1) {
				//this.productId && GetCartStateManager().updateProduct({ productId: this.productId, productCount: 0 });
				this.block?.classList.remove('js-counter-active');
			} else {
				//GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
			}
		}
	};

	#bindSecondButtonState() {
		super.getPlusButton?.removeEventListener('click', this.#bindPlus);
		super.getMinusButton?.removeEventListener('click', this.#bindMinus);

		super.getPlusButton?.addEventListener('click', this.#confirmInput);
		super.getMinusButton?.addEventListener('click', this.#cancelInput);
	}
	#unbindSecondButtonState() {
		super.getPlusButton?.removeEventListener('click', this.#confirmInput);
		super.getMinusButton?.removeEventListener('click', this.#cancelInput);

		super.setButtonListener();
		super.getPlusButton?.addEventListener('click', this.#bindPlus);
		super.getMinusButton?.addEventListener('click', this.#bindMinus);
	}
}

export function CardProductCounter(block: HTMLElement, productId: string | null) {
	const blockClass: string = '.card-product-counter';
	const element: HTMLElement | null = block.querySelector(`${blockClass}`);

	if (!element) return null;
	return new CardProductCounterControl(element, productId, blockClass);
}
*/
