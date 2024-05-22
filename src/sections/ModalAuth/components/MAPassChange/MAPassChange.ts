import { InputArray, InputControl } from '../../../../shared/ui';
import { useDebounce } from '../../../../shared/helpers/js/useDebounce';
import { ActionType } from '../../ModalAuth';

interface MAPassChangeControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

interface MAPassChangePayload {
	userId: string;
	code: string;
}

export class MAPassChangeControl {
	CLASS_DISPLAY_NONE: string = 'd-none';
	CLASS_INPUT_ERROR: string = 'js-error';

	block;
	blockClass;
	dispatch;

	buttonSubmit: HTMLButtonElement | null;
	inputInstances: InputControl[];
	inputsErrors: Record<string, string> | null;
	errorMessage: HTMLElement | null;
	userId: string | null;
	code: string | null;

	constructor({ element, class: blockClass, dispatch }: MAPassChangeControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;

		this.buttonSubmit = this.block.querySelector('[type = "submit"]');

		this.inputInstances = [];
		this.errorMessage;

		this.#init();
	}

	#init() {
		this.#initInputs();
		this.#initSubmitButton();
		this.#initSubmit();
	}

	#initInputs() {
		this.inputInstances = InputArray(this.block);
	}

	#initSubmitButton() {
		const inputFields: NodeListOf<HTMLInputElement> | undefined =
			this.block.querySelectorAll('.input__field[required]');

		const checkInputsFilled = () => {
			let areInputsFilled = true;

			inputFields.forEach((inputField) => {
				if (inputField.value.trim() === '') {
					areInputsFilled = false;
				}
			});

			this.buttonSubmit && (this.buttonSubmit.disabled = !areInputsFilled);
		};

		inputFields.forEach((inputField) => {
			const input = inputField.closest('.input');
			input?.addEventListener('click', checkInputsFilled);
			inputField.addEventListener('input', checkInputsFilled);
		});
	}

	#initSubmit() {
		const form = this.block.querySelector('form');
		if (!form) return;

		const handleSubmit = () => {
			this.buttonSubmit?.setAttribute('disabled', 'disabled');

			let valid = true;

			this.inputInstances?.forEach((inputInstance) => {
				if (!inputInstance.isValid()) {
					valid = false;
				}
			});

			const isEqualPasswords = this.#comparePasswords(form);
			if (!isEqualPasswords) {
				valid = false;
			}

			if (!valid) {
				this.buttonSubmit?.removeAttribute('disabled');
				return;
			}

			const userIdInput: HTMLInputElement | null = form.querySelector('#change-password-user-id');
			const codeInput: HTMLInputElement | null = form.querySelector('#change-password-code');

			userIdInput && this.userId && (userIdInput.value = this.userId);
			codeInput && this.code && (codeInput.value = this.code);

			const options: RequestInit = {
				method: form.method,
				credentials: 'include',
			};
			form.method.toUpperCase() === 'POST' && (options.body = new FormData(form as HTMLFormElement));

			fetch(form.action, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.errors) {
						this.#showNewInputsErrors(data.errors);
					}
					if (data.errorMessage) {
						this.#showErrorMessage(data.errorMessage);
					} else {
						this.dispatch({ type: ActionType.SHOW_PASS_SUCCESS });
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
		};
		const debouncedHandleSubmit = useDebounce(handleSubmit, 250);
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.#removeErrorMessage();
			debouncedHandleSubmit();
		});
	}

	#showErrorMessage(message: string) {
		if (this.errorMessage) {
			this.errorMessage.textContent = message;
			this.errorMessage.classList.remove(this.CLASS_DISPLAY_NONE);
		} else {
			const errorMessage = document.createElement('span');
			errorMessage.classList.add('text', 'text_caption', 'text_red', 'modal-auth__error');
			errorMessage.textContent = message;
			this.errorMessage = errorMessage;

			this.buttonSubmit?.before(errorMessage);
		}
	}

	#removeErrorMessage() {
		if (!this.errorMessage) return;
		this.errorMessage.classList.add(this.CLASS_DISPLAY_NONE);
	}

	#comparePasswords(form: HTMLFormElement) {
		const inputs: NodeListOf<HTMLInputElement> | undefined = form.querySelectorAll('input[type="password"]');
		const isEqual = Array.from(inputs)
			.map((input) => input.value)
			.every((value, _, array) => value === array[0]);
		if (isEqual) {
			return true;
		} else {
			const input: HTMLElement | null | undefined = form.querySelector('input[name="password"]')?.closest('.input');
			input?.classList.add(this.CLASS_INPUT_ERROR);
			return false;
		}
	}

	#showNewInputsErrors(errorsObject: Record<string, string[]>) {
		Object.entries(errorsObject).map(([name, errors]) => {
			const inputField = this.block.querySelector(`[name = ${name}]`);
			const input = inputField?.closest('.input');
			const inputError = input?.querySelector('.input__error');
			inputError && (inputError.textContent = errors.join('. ')) && input?.classList.add(this.CLASS_INPUT_ERROR);
		});
	}

	#collectDefaultInputsErrors() {
		const inputs = this.block.querySelectorAll('.input');
		return (
			(inputs?.length &&
				Array.from(inputs).reduce((acc: Record<string, string>, input) => {
					const inputName = input.querySelector('.input__field')?.getAttribute('name');
					const inputErrorText = input.querySelector('.input__error')?.textContent;
					inputName && inputErrorText && (acc[inputName] = inputErrorText);
					return acc;
				}, {})) ||
			null
		);
	}

	#initInputObservers(inputsErrors: Record<string, string> | null) {
		const inputs: NodeListOf<HTMLElement> = this.block.querySelectorAll('.input');
		inputs.forEach((input) => this.#initInputObserver(input, inputsErrors));
	}

	#initInputObserver(input: HTMLElement, inputsErrors: Record<string, string> | null) {
		const observer = new MutationObserver(
			() => !input.classList.contains(this.CLASS_INPUT_ERROR) && this.#setDefaultInputError(input, inputsErrors)
		);
		observer.observe(input, { attributes: true });
	}

	#setDefaultInputError(input: HTMLElement, inputsErrors: Record<string, string> | null) {
		const inputFieldName = input.querySelector('.input__field')?.getAttribute('name');
		const inputError = input?.querySelector('.input__error');
		inputFieldName && inputError && inputsErrors && (inputError.textContent = inputsErrors[inputFieldName]);
	}

	show({ userId, code }: MAPassChangePayload) {
		this.userId = userId;
		this.code = code;
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	hide() {
		this.userId = null;
		this.code = null;
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
	}
}

export function MAPassChange(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-pass-change';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MAPassChangeControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
