import { InputArray, InputControl, ModalControl } from '../../shared/ui';
import { useDebounce } from '../../shared/helpers/js/useDebounce';

class ModalFeedbackControl extends ModalControl {
	block: HTMLElement;
	body: HTMLElement | null;
	form: HTMLFormElement | null;
	inputArr: NodeListOf<HTMLInputElement> | null;
	button: HTMLElement | null;
	inputInstances: InputControl[];
	buttonSendFeedback: HTMLElement | null;
	apiLink: string | null;
	blockObject: Record<string, HTMLElement | null>;
	errorBlockBackButton: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		super(block);

		this.block = block;
		this.body = document.querySelector('body');
		this.form = this.block.querySelector('form');
		this.apiLink = this.form && this.form.action;
		this.inputArr = this.block.querySelectorAll('.input');
		this.inputInstances = InputArray(this.block);
		this.buttonSendFeedback = this.block.querySelector('[type = "submit"]');
		this.blockObject = {
			mainBlock: this.block.querySelector(`${blockClass}__main`),
			successBlock: this.block.querySelector(`${blockClass}__success`),
			errorBlock: this.block.querySelector(`${blockClass}__error`),
		};
		this.errorBlockBackButton = this.blockObject.errorBlock?.querySelector(`${blockClass}__back-button`) || null;

		this.#init();
	}

	#init() {
		this.#bindModalFeedbackClose();
		this.#bindInput();
		this.#bindSubmitButton();
		this.#bindBackButton();
	}

	#bindInput() {
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

	#bindModalFeedbackClose() {
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
			if (key !== 'mainBlock') {
				this.blockObject[key]?.classList.add('d-none');
			} else {
				this.blockObject[key]?.classList.remove('d-none');
			}
		}
	}

	#bindBackButton() {
		this.errorBlockBackButton?.addEventListener('click', () => {
			this.blockObject.errorBlock?.classList.add('d-none');
			this.blockObject.mainBlock?.classList.remove('d-none');
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
		this.blockObject.mainBlock?.classList.add('d-none');
	}

	#showSuccess() {
		if (!this.blockObject.successBlock) return;
		this.blockObject.successBlock.classList.remove('d-none');
		this.blockObject.mainBlock?.classList.add('d-none');
	}

	#changeButtonState() {
		if (this.#isAllFieldFilled()) {
			this.buttonSendFeedback?.removeAttribute('disabled');
		} else {
			this.buttonSendFeedback?.setAttribute('disabled', 'disabled');
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
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-feedback';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);
	element && new ModalFeedbackControl(element, BLOCK_CLASS);
});
