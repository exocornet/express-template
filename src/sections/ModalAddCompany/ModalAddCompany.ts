import { InputArray, InputControl, ModalControl } from '../../shared';
import { useDebounce } from '../../shared/helpers/js/useDebounce';
import { InputInn, InputInnControl } from '../../shared/ui/InputInn/InputInn';

class ModalAddCompanyControl extends ModalControl {
	block: HTMLElement;
	modal: ModalControl;
	body: HTMLElement | null;
	form: HTMLFormElement | null;
	inputArr: NodeListOf<HTMLInputElement> | null;
	button: HTMLElement | null;
	inputInstances: InputControl[];
	inputInnInstances: InputInnControl[];
	cart: HTMLElement | null;
	buttonAddCompany: HTMLElement | null;
	apiLink: string | null;

	constructor(block: HTMLElement) {
		super(block);

		this.block = block;
		this.body = document.querySelector('body');
		this.form = this.block.querySelector('form');
		this.apiLink = this.form && this.form.action;
		this.inputArr = this.block.querySelectorAll('.input');
		this.inputInstances = InputArray(this.block);
		this.inputInnInstances = InputInn(this.block);
		this.buttonAddCompany = this.block.querySelector('[type = "submit"]');

		this.#init();
	}

	#init() {
		this.#bindModalCompanyControl();
		this.#bindInput();
		this.#bindSubmitButton();
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

	#bindModalCompanyControl() {
		super.getCloseButton?.addEventListener('click', () => {
			this.#closeHandler();
		});
		super.getBackground?.addEventListener('click', () => {
			this.#closeHandler();
		});
	}

	#closeHandler() {
		this.inputInstances.forEach((inputInstance) => {
			inputInstance.reset();
			this.#changeButtonState();
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
		//TODO ПРИДУМАТЬ ОБРАБОТКУ ДЛЯ ФОРМЫ
		this.inputInnInstances.forEach((inputInn) => {
			const inputInnData = inputInn.getActiveItemData;
			if (inputInnData) {
				for (const key in inputInnData) {
					const item = inputInnData[key];
					body.set(`${key}`, item);
				}
			}
		});

		this.apiLink &&
			fetch(this.apiLink, {
				method: 'POST',
				body: body,
			})
				.then((response) => {
					if (response.status === 200) {
						return response.json();
					}
				})
				.then((data) => {
					if (data) {
						const addCompanyEvent = new CustomEvent('addCompanyEvent', {
							detail: data,
						});
						document.querySelector('.company-info')?.dispatchEvent(addCompanyEvent);
						this.#closeHandler();
						super.closeModal();
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

	#changeButtonState() {
		if (this.#isAllFieldFilled()) {
			this.buttonAddCompany?.removeAttribute('disabled');
		} else {
			this.buttonAddCompany?.setAttribute('disabled', 'disabled');
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
	const BLOCK_CLASS = '.modal-add-company';
	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	element && new ModalAddCompanyControl(element);
});
