import { InputArray, InputControl, ModalControl } from '../../shared/ui';
import { useDebounce } from '../../shared/helpers/js/useDebounce';
import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

class ModalChangeDataControl extends ModalControl {
	block: HTMLElement;
	modal: ModalControl;
	body: HTMLElement | null;
	form: HTMLFormElement | null;
	inputArr: NodeListOf<HTMLInputElement> | null;
	button: HTMLElement | null;
	inputInstances: InputControl[];
	cart: HTMLElement | null;
	buttonCreateOrder: HTMLElement | null;
	apiLink: string | null;
	cartApi: string | null;
	blockObject: Record<string, HTMLElement | null>;
	errorBlockBackButton: HTMLElement | null;
	elementPriceText: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		super(block);

		this.block = block;
		this.body = document.querySelector('body');
		this.form = this.block.querySelector('form');
		this.apiLink = this.form && this.form.action;
		this.inputArr = this.block.querySelectorAll('.input');
		this.inputInstances = InputArray(this.block);
		this.buttonCreateOrder = this.block.querySelector('[type = "submit"]');
		this.cart = document.querySelector('.cart');
		this.cartApi = this.cart && this.cart.getAttribute('data-api-cart-url');
		this.blockObject = {
			orderBlock: this.block.querySelector(`${blockClass}__order`),
			successBlock: this.block.querySelector(`${blockClass}__success`),
			errorBlock: this.block.querySelector(`${blockClass}__error`),
		};
		this.errorBlockBackButton = this.blockObject.errorBlock?.querySelector(`${blockClass}__back-button`) || null;
		this.elementPriceText = this.block.querySelector(`${blockClass}__text`);

		this.#init();
	}

	#init() {
		super.removeAllModalOpenButtons();
		this.#rebindOpenButton();
		this.#bindModalBuyInOneClose();
		this.#bindInput();
		this.#bindSubmitButton();
		this.#bindBackButton();

		if (this.cart) {
			this.#createCartObserver();
		}
	}

	#bindInput() {
		this.inputInstances.forEach((instance) => instance.checkInputFilled());
		this.#changeButtonState();

		this.inputArr?.forEach((input) => {
			input.addEventListener('input', () => {
				this.#changeButtonState();
			});
		});

		this.inputInstances.forEach((inputInstance) => {
			inputInstance.elementIconClose?.addEventListener('click', () => {
				this.#changeButtonState();
			});
		});
	}

	#bindModalBuyInOneClose() {
		super.getCloseButton?.addEventListener('click', () => {
			this.#closeHandler();
		});
		super.getBackground?.addEventListener('click', () => {
			this.#closeHandler();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key == this.KEY_ESC) {
				this.#closeHandler();
			}
		});
	}

	#closeHandler() {
		this.inputInstances.forEach((inputInstance) => {
			inputInstance.reset();
			this.#changeButtonState();
		});

		for (const key in this.blockObject) {
			if (key !== 'orderBlock') {
				this.blockObject[key]?.classList.add('d-none');
			} else {
				this.blockObject[key]?.classList.remove('d-none');
			}
		}
	}

	#bindBackButton() {
		this.errorBlockBackButton?.addEventListener('click', () => {
			this.blockObject.errorBlock?.classList.add('d-none');
			this.blockObject.orderBlock?.classList.remove('d-none');
		});
	}

	#bindSubmitButton() {
		const handleSubmit = () => {
			if (this.#checkValidity()) {
				this.#apiFetch();
			}
		};

		const debouncedHandleSubmit = useDebounce(handleSubmit, 250);
		this.form?.addEventListener('submit', (e) => {
			e.preventDefault();
			debouncedHandleSubmit();
		});
	}

	#apiFetch() {
		const body = new FormData(this.form as HTMLFormElement);
		if (body) {
			const phone = String(body.get('phone'));
			body.set('phone', phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', ''));
		}

		this.apiLink &&
			fetch(this.apiLink, {
				method: 'POST',
				body: body,
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.errors) {
						this.#showNewInputsErrors(data.errors);
					} else if (data.errorMessage) {
						this.#showError(data.errorMessage);
					} else {
						this.#showSuccess();
					}
				});
	}

	#showNewInputsErrors(errorsObject: Record<string, string[]>) {
		Object.entries(errorsObject).map(([name, errors]) => {
			this.inputInstances.forEach((inputInstance) => {
				if (inputInstance.input?.name === name) {
					inputInstance.setError(errors);
				}
			});
		});
	}

	#showError(error: string) {
		if (!this.blockObject.errorBlock) return;

		const errorBlockHeading = this.blockObject.errorBlock.querySelector('.modal-buy-in-one__error-heading');
		errorBlockHeading && (errorBlockHeading.textContent = error);
		this.blockObject.errorBlock.classList.remove('d-none');
		this.blockObject.orderBlock?.classList.add('d-none');
	}

	#showSuccess() {
		if (!this.blockObject.successBlock) return;
		this.blockObject.successBlock.classList.remove('d-none');
		this.blockObject.orderBlock?.classList.add('d-none');

		this.cart?.dispatchEvent(new Event('updateCartProduct'));
	}

	#changeButtonState() {
		if (this.#isAllFieldFilled()) {
			this.buttonCreateOrder?.removeAttribute('disabled');
		} else {
			this.buttonCreateOrder?.setAttribute('disabled', 'disabled');
		}
	}

	#checkValidity() {
		let fieldValid = true;

		this.inputInstances.forEach((inputInstance) => {
			const valid = inputInstance.isValid();
			if (!valid) fieldValid = valid;
		});

		return fieldValid;
	}

	#isAllFieldFilled() {
		let isAllFilled = true;
		this.inputInstances.forEach((input) => {
			if (!input.getIsFilled) isAllFilled = false;
		});

		return isAllFilled;
	}

	#createCartObserver() {
		const targetNode = this.cart as Node;
		const config = { attributes: true, childList: true, subtree: true };

		const callback = (mutationList: any) => {
			for (const mutation of mutationList) {
				if (mutation.type === 'childList') {
					this.#rebindOpenButton();
				}
			}
		};

		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}

	#rebindOpenButton() {
		useMediaQuery(
			1280,
			() => {
				if (this.cart) {
					super.removeAllModalOpenButtons();
					const newOpenButton: HTMLElement | null = document.querySelector('[data-modal-form=buy-in-one]');

					this.#bindOpenButton();

					newOpenButton &&
						newOpenButton.addEventListener('click', () => {
							if (Number(newOpenButton.getAttribute('state')) > 1) {
								super.showModalInstance();
							}
						});
				}
			},
			() => {
				const newOpenButtons: any[] = [...document.querySelectorAll('[data-modal-form=buy-in-one]')];
				super.rebindModalOpenButtons(newOpenButtons);
				this.#bindOpenButton();
			}
		);
	}

	#bindOpenButton() {
		super.getOpenButtonArr.forEach((openButton) => {
			openButton.addEventListener('click', () => {
				const price: string | null = openButton.getAttribute('data-price');
				if (price && this.elementPriceText) {
					this.elementPriceText.textContent = price;
				}
			});
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-buy-in-one';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);
	element && new ModalChangeDataControl(element, BLOCK_CLASS);
});
