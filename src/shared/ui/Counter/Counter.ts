import { GetCartStateManager } from '../CartStateManager/CartStateManager';

export class CounterControl {
	block: HTMLElement;
	blockClass: string;
	blockClassContains: string;
	elementInput: HTMLInputElement | null;
	elementButtonPlus: HTMLButtonElement | null;
	elementButtonMinus: HTMLElement | null;
	elementItemCountNow: number;
	elementItemMaxValue: number;
	elementItemMinValue: number;
	elementInputUnit: string;
	elementLastCount: number;
	initImmediately: boolean;
	activateButton: HTMLElement | null;
	productId: string | null;

	constructor(
		block: HTMLElement,
		blockClass: string,
		productId: string | null,
		activateButton?: HTMLElement,
		initImmediately?: boolean
	) {
		this.block = block;
		this.blockClass = blockClass;
		this.blockClassContains = blockClass.slice(1);

		this.elementInput = this.block.querySelector(`${blockClass}__input`);
		this.elementButtonPlus = this.block.querySelector(`${blockClass}__button-plus`);
		this.elementButtonMinus = this.block.querySelector(`${blockClass}__button-minus`);

		this.activateButton = activateButton || null;
		this.initImmediately = initImmediately !== undefined ? initImmediately : true;
		this.productId = productId;

		this.elementItemMinValue = Number(this.elementInput?.dataset.minValue) || 1;
		this.elementItemMaxValue = Number(this.elementInput?.dataset.maxValue) || 10;
		if (this.elementInput?.getAttribute('value') === '' || this.elementInput?.getAttribute('value') === null) {
			this.elementItemCountNow = this.elementItemMinValue - 1;
		} else {
			const valueNow = Number(this.elementInput?.getAttribute('value'));
			this.elementItemCountNow = valueNow < this.elementItemMinValue ? this.elementItemMinValue - 1 : valueNow;
		}

		this.elementLastCount = this.elementItemCountNow;
		this.elementInputUnit = this.elementInput?.dataset.inputUnit || 'шт';

		// вызов метода инициализации класса
		this.#init();
	}

	get getProductId() {
		return this.productId;
	}

	get getCount() {
		return this.elementItemCountNow;
	}

	get getMinValue() {
		return this.elementItemMinValue;
	}

	get getPlusButton() {
		return this.elementButtonPlus;
	}

	get getInput() {
		return this.elementInput;
	}

	get getMinusButton() {
		return this.elementButtonMinus;
	}

	#init() {
		this.block?.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
		this.#bindButtons();
		this.#initInput();
		this.#initActivateButton();
	}

	#initActivateButton() {
		const handler = () => {
			this.elementItemCountNow = this.elementLastCount;
			this.#setCount(this.elementItemCountNow);
			this.productId &&
				GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
		};

		this.activateButton && this.activateButton.addEventListener('click', handler);
	}

	#initInput() {
		this.elementInput && (this.elementInput.value = this.elementItemCountNow + ' ' + this.elementInputUnit);
		this.#bindInput();
	}

	#bindButtons() {
		if (this.initImmediately) {
			this.elementButtonPlus?.addEventListener('click', this.#initPlus);
			this.elementButtonMinus?.addEventListener('click', this.#initMinus);
		}
	}

	#unbindButtons() {
		this.elementButtonPlus?.removeEventListener('click', this.#initPlus);
		this.elementButtonMinus?.removeEventListener('click', this.#initMinus);
	}

	#initPlus = () => {
		this.elementLastCount = this.elementItemCountNow;

		if (this.elementItemCountNow < this.elementItemMaxValue) {
			this.elementItemCountNow++;
		}

		this.#setCount(this.elementItemCountNow);

		if (this.elementItemCountNow !== this.elementLastCount) {
			this.productId &&
				GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
		}
	};

	#initMinus = () => {
		this.elementLastCount = this.elementItemCountNow;

		if (this.elementItemCountNow > this.elementItemMinValue) {
			this.elementItemCountNow--;
			this.productId &&
				GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
		} else {
			this.elementItemCountNow = this.elementItemMinValue - 1;
			this.productId && GetCartStateManager().updateProduct({ productId: this.productId, productCount: 0 });
		}

		this.#setCount(this.elementItemCountNow);
	};

	#bindInput() {
		this.elementInput?.addEventListener('focusin', () => {
			//this.unsetButtonListener();
		});
		this.elementInput?.addEventListener('focusout', (e) => {
			const target: HTMLElement = <HTMLElement>e.relatedTarget;
			if (!target?.classList.contains(`${this.blockClassContains}__button-minus`)) {
				const el = this.elementInput?.value.replace(' ', '') || '';
				const countNow = Number(el.match(/\d+/)?.toString());

				if (countNow > this.elementItemMaxValue) {
					this.elementItemCountNow = this.elementItemMaxValue;
				} else if (countNow < this.elementItemMinValue) {
					this.elementItemCountNow = this.elementItemMinValue;
				} else {
					this.elementItemCountNow = countNow;
				}

				this.#setCount(this.elementItemCountNow);
			} else if (target?.classList.contains(`${this.blockClassContains}__button-minus`)) {
				this.#setCount(this.elementItemCountNow);
			}
		});
		this.elementInput?.addEventListener('keypress', (e) => {
			const key = e.key.toLowerCase();
			const regex = /[0-9]/;
			if (!regex.test(key)) {
				if (e.preventDefault) e.preventDefault();
			}
			if (key === 'enter') {
				this.elementInput?.blur();
				this.setButtonListener();
			}
		});
	}

	#setCount(value: number) {
		this.elementInput && (this.elementInput.value = value + ' ' + this.elementInputUnit);
	}

	setValue(value: number) {
		if (value < this.elementItemMinValue) {
			this.elementItemCountNow = this.elementItemMinValue - 1;
		} else {
			this.elementItemCountNow = value;
		}

		this.#setCount(this.elementItemCountNow);
	}

	setButtonListener() {
		this.#bindButtons();
	}

	unsetButtonListener() {
		this.#unbindButtons();
	}
}

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

		/*if (this.elementItemCountNow !== this.elementLastCount) {
			this.productId &&
				GetCartStateManager().updateProduct({ productId: this.productId, productCount: this.elementItemCountNow });
		}*/
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
