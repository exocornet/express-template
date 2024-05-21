import { InputArray, InputControl, ModalControl } from '../../shared';
import { useDebounce } from '../../shared/helpers/js/useDebounce';

const inputValidation = ['text', 'inn', 'email', 'fullName', 'phone', 'kpp', 'ogrn', 'phoneOrEmail', 'password'];

export class ModalChangeDataControl extends ModalControl {
	CLASS_INPUT_ERROR: string = 'js-error';
	CLASS_DISPLAY_NONE: string = 'd-none';
	TEXT_INPUT_ERROR: string = 'Введите корректные данные';

	block: HTMLElement;
	pageBody: HTMLElement | null;
	modalContent: HTMLElement | null;
	form: HTMLFormElement | null;
	input: HTMLElement | null;
	button: HTMLButtonElement | null;
	inputInstances: InputControl[] | null;
	inputData: Record<string, string>;
	inputValue: string;
	changeDataElement: HTMLElement | null;
	errorMessage: HTMLElement | null;
	passwordSuccess: HTMLElement | null;

	private _companyId: string;

	constructor(block: HTMLElement) {
		super(block);

		this.block = block;
		this.pageBody = document.querySelector('body');
		this.modalContent = this.block.querySelector('.modal-change-data__content');
		this.form = this.block.querySelector('form');
		this.input = this.block.querySelector('.input');
		this.button = this.block.querySelector('[type = "submit"]');

		this.init();
	}

	set companyId(companyId: string) {
		this._companyId = companyId;
	}

	init() {
		this.#addCustomEvent();
		this.#onOpen();
		this.#onClose();
		this.#initSubmit();
	}

	#addCustomEvent() {
		super.getOpenButtonArr.forEach((openButton) => {
			openButton.addEventListener('click', () => {
				const openModalEvent = new Event('modalOpenCustom', { bubbles: true });
				openButton.dispatchEvent(openModalEvent);
			});
		});
	}

	#onOpen() {
		document.addEventListener('modalOpenCustom', (event) => {
			this.#initInput(event);
			this.#addInputListeners();
		});
	}

	#onClose() {
		this.block.addEventListener('modalCloseCustom', () => this.#reset());
	}

	#initInput(event: Event) {
		this.inputData = JSON.parse((event.target as HTMLElement).getAttribute('data-modal-input-data') || '');
		this.changeDataElement =
			(event.target as HTMLElement).closest('.article-list__article')?.querySelector('.article-list__description') ||
			null;
		this.inputValue = this.changeDataElement?.textContent || '';

		if (!this.inputData.name) {
			this.#closeModal();
			return;
		}
		if (!this.inputData || !this.input) return;

		if (this.inputData['data-validation-type'] === 'password') {
			this.#addExtraPasswordInput();
			this.#fillInput(this.inputData);
		} else if (this.inputData['data-validation-type'] === 'phone') {
			let newInputValue;
			if (this.inputValue) {
				newInputValue = this.inputValue.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '');
				newInputValue = newInputValue.slice(-10);
			}
			this.#fillInput(this.inputData, newInputValue);
		} else {
			this.#fillInput(this.inputData, this.inputValue);
		}
		this.#initInputObserver();
	}

	#addExtraPasswordInput() {
		const input = document.createElement('div');
		input.classList.add('input', 'extra-input');
		input.innerHTML = `
			<input class="input__field" type="password" name="passwordConfirm" data-validation-type="password" required="required" autocomplete="off">
			<svg class="input__icon-close d-none" viewBox="0 0 24 24" fill="none">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M5.20503 5.20503C5.47839 4.93166 5.92161 4.93166 6.19497 5.20503L12 11.01L17.805 5.20503C18.0784 4.93166 18.5216 4.93166 18.795 5.20503C19.0683 5.47839 19.0683 5.92161 18.795 6.19497L12.9899 12L18.795 17.805C19.0683 18.0784 19.0683 18.5216 18.795 18.795C18.5216 19.0683 18.0784 19.0683 17.805 18.795L12 12.9899L6.19497 18.795C5.92161 19.0683 5.47839 19.0683 5.20503 18.795C4.93166 18.5216 4.93166 18.0784 5.20503 17.805L11.01 12L5.20503 6.19497C4.93166 5.92161 4.93166 5.47839 5.20503 5.20503Z" fill="currentColor"></path>
			</svg>
			<span class="text text_gray input__label">Повторить пароль</span>
			<span class="text text_caption text_red input__error">Введенные пароли не совпадают</span>
		`;

		this.input?.after(input);
	}

	#removeExtraPasswordInput() {
		const input = this.block.querySelector('.extra-input');
		input?.remove();
	}

	#comparePasswords(form: HTMLFormElement) {
		const inputs: NodeListOf<HTMLInputElement> | undefined = form.querySelectorAll('input[type="password"]');
		const isEqual = Array.from(inputs)
			.map((input) => input.value)
			.every((value, _, array) => value === array[0]);
		if (isEqual) {
			return true;
		} else {
			const input: HTMLElement | null | undefined = form
				.querySelector('input[name="passwordConfirm"]')
				?.closest('.input');
			input?.classList.add(this.CLASS_INPUT_ERROR);
			return false;
		}
	}

	#fillInput(inputData?: Record<string, string>, inputValue?: string) {
		const inputField = this.input?.querySelector('input');
		const inputLabel = this.input?.querySelector('.input__label');
		const inputError = this.input?.querySelector('.input__error');
		if (!inputField || !inputLabel || !inputError) return;

		if (!inputData) {
			//this.inputInstances.forEach((instance) => instance.reset());
			inputField.removeAttribute('name');
			inputField.removeAttribute('validationType');
			inputLabel.textContent = '';
			inputError.textContent = '';
		} else {
			inputField.name = inputData.name;
			inputField.type = inputData['data-validation-type'] === 'password' ? 'password' : 'text';
			inputLabel.textContent = inputData.label || '';
			inputError.textContent = inputData.error || this.TEXT_INPUT_ERROR;
			inputField.dataset.validationType = inputValidation.includes(inputData['data-validation-type'])
				? inputData['data-validation-type']
				: 'text';
			inputValue && (inputField.value = inputValue.trim());

			this.inputInstances = InputArray(this.block);
			this.inputInstances.forEach((instance) => instance.checkInputFilled());
		}
	}

	#checkInputsFilled(inputFields: NodeListOf<HTMLInputElement>) {
		const inputField: HTMLInputElement | undefined | null = this.input?.querySelector('.input__field');

		let areInputsFilled = true;
		let isNewValue = false;

		inputFields.forEach((inputField) => {
			if (inputField.value.trim() === '') {
				areInputsFilled = false;
			}
		});
		isNewValue = inputField?.value !== this.inputValue;

		this.button && (this.button.disabled = !areInputsFilled || !isNewValue);
	}

	#addInputListeners() {
		const inputFields: NodeListOf<HTMLInputElement> | undefined =
			this.block.querySelectorAll('.input__field[required]');

		inputFields.forEach((inputField) => {
			const closeButton = inputField.closest('.input')?.querySelector('.input__icon-close');
			inputField.addEventListener('input', () => this.#checkInputsFilled(inputFields));
			closeButton?.addEventListener('click', () => this.#checkInputsFilled(inputFields));
		});
	}

	#removeInputListeners() {
		const inputFields: NodeListOf<HTMLInputElement> | undefined =
			this.block.querySelectorAll('.input__field[required]');

		inputFields.forEach((inputField) => {
			const closeButton = inputField.closest('.input')?.querySelector('.input__icon-close');
			inputField.removeEventListener('input', () => this.#checkInputsFilled(inputFields));
			closeButton?.removeEventListener('click', () => this.#checkInputsFilled(inputFields));
		});
	}

	#showErrorMessage(message: string) {
		if (this.errorMessage) {
			this.errorMessage.textContent = message;
			this.errorMessage.classList.remove(this.CLASS_DISPLAY_NONE);
		} else {
			const errorMessage = document.createElement('span');
			errorMessage.classList.add('text', 'text_caption', 'text_red', 'modal-change-data__error');
			errorMessage.textContent = message;
			this.errorMessage = errorMessage;

			this.button?.before(errorMessage);
		}
	}

	#removeErrorMessage() {
		if (!this.errorMessage) return;
		this.errorMessage.classList.add(this.CLASS_DISPLAY_NONE);
	}

	#initSubmit() {
		if (!this.form) return;

		const handleSubmit = () => {
			this.button?.setAttribute('disabled', 'disabled');

			let valid = true;

			this.inputInstances?.forEach((inputInstance) => {
				if (!inputInstance.isValid()) {
					valid = false;
				}
			});

			const isEqualPasswords = this.#comparePasswords(this.form as HTMLFormElement);
			if (!isEqualPasswords) {
				valid = false;
			}

			if (!valid) {
				this.button?.removeAttribute('disabled');
				return;
			}

			const options: RequestInit = {
				method: this.form?.method,
				credentials: 'include',
			};

			if (!this.form) return;
			const formData = new FormData(this.form);
			if (formData.get('phone')) {
				const phone = String(formData.get('phone'));
				formData.set('phone', phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', ''));
			}

			formData.set('type', this.inputData.name || 'type');
			if (this._companyId) {
				formData.set('id', this._companyId);
			}
			this.form?.method.toUpperCase() === 'POST' && (options.body = formData);

			fetch((this.form as HTMLFormElement).action, options)
				.then((response) => response.json())
				.then((data) => {
					if (!data.errors && !data.errorMessage) {
						this.#changeData();
						this.inputData['data-validation-type'] === 'password' ? this.#showPasswordSuccess() : this.#closeModal();
					}
					if (data.errors) {
						this.#showNewInputError(data.errors);
					}
					if (data.errorMessage) {
						this.#showErrorMessage(data.errorMessage);
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				})
				.finally(() => {
					this.button?.removeAttribute('disabled');
				});
		};

		const debouncedHandleSubmit = useDebounce(handleSubmit, 250);
		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.#removeErrorMessage();
			debouncedHandleSubmit();
		});
	}

	#showPasswordSuccess() {
		if (this.passwordSuccess) {
			this.modalContent?.classList.add(this.CLASS_DISPLAY_NONE);
			this.passwordSuccess.classList.remove(this.CLASS_DISPLAY_NONE);
		} else {
			this.passwordSuccess = document.createElement('div');
			this.passwordSuccess.classList.add('modal-change-data__password-success');
			this.passwordSuccess.innerHTML = `
				<p class="heading heading_h2 text-align-center mb-32">Пароль успешно изменён</p>
				<span class="text text_body-l-m text-align-center modal-change-data__text mb-32">Пароль изменен успешно</span>
				<button class="button w-100 modal-change-data__button mt-0" type="button">
					<span class="button__text">Перейти обратно в личный кабинет</span>
				</button>
			`;
			const modalBody = this.block.querySelector('.modal-change-data__modal-body');
			const buttonClose = this.passwordSuccess.querySelector('.modal-change-data__button');

			buttonClose?.addEventListener('click', () => this.#closeModal());
			this.modalContent?.classList.add(this.CLASS_DISPLAY_NONE);
			modalBody?.append(this.passwordSuccess);
		}
	}

	#hidePasswordSuccess() {
		this.modalContent?.classList.remove(this.CLASS_DISPLAY_NONE);
		this.passwordSuccess?.classList.add(this.CLASS_DISPLAY_NONE);
	}

	#showNewInputError(errorsObject: Record<string, string[]>) {
		const inputFieldName = this.input?.querySelector('input')?.name;
		const inputError = this.input?.querySelector('.input__error');
		inputFieldName &&
			inputError &&
			(inputError.textContent = errorsObject[inputFieldName].join('. ')) &&
			this.input?.classList.add(this.CLASS_INPUT_ERROR);
	}

	#initInputObserver() {
		if (!this.input) return;
		const observer = new MutationObserver(
			() => !this.input?.classList.contains(this.CLASS_INPUT_ERROR) && this.#setDefaultInputError()
		);
		observer.observe(this.input, { attributes: true });
	}

	#setDefaultInputError() {
		const inputError = this.input?.querySelector('.input__error');
		inputError && (inputError.textContent = this.inputData.error || this.TEXT_INPUT_ERROR);
	}

	#changeData() {
		if (!this.changeDataElement || !this.input) return;
		const inputField = this.input.querySelector('input');
		if (!inputField || !inputField.value) return;
		this.changeDataElement.textContent =
			this.inputData['data-validation-type'] === 'password' ? inputField.value.replace(/\S/g, '*') : inputField.value;
	}

	#closeModal() {
		this.#reset();
		super.closeModal();
	}

	#reset() {
		this.#fillInput();
		this.inputInstances &&
			this.inputInstances.forEach((inputInstance) => {
				inputInstance.removeValidation();
				inputInstance.reset();
			});
		this.inputInstances = null;
		this.inputData = {};
		this.inputValue = '';
		this.changeDataElement = null;
		this.#removeInputListeners();
		this.#removeExtraPasswordInput();
		this.button && (this.button.disabled = true);
		this.#hidePasswordSuccess();
	}

	rebindModalChangeDataButtons() {
		super.rebindModalOpenButtonsByTag();
		this.#addCustomEvent();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-change-data';
	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	if (element) {
		const el = element as IModalChangeData;
		el.modalChangeData = new ModalChangeDataControl(element);
	}
});

export interface IModalChangeData extends HTMLElement {
	modalChangeData: ModalChangeDataControl;
}
