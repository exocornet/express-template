import { InputArray, InputControl } from '../../../../shared/ui';
import { useDebounce } from '../../../../shared/helpers/js/useDebounce';
import { ActionType } from '../../ModalAuth';
import { MACodeType } from '../MACode/MACode';

interface MAPassRecoveryControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

export class MAPassRecoveryControl {
	CLASS_DISPLAY_NONE: string = 'd-none';
	CLASS_INPUT_ERROR: string = 'js-error';

	block;
	blockClass;
	dispatch;

	buttonBack: HTMLButtonElement | null;
	buttonSubmit: HTMLButtonElement | null;
	buttonSignUp: HTMLButtonElement | null;
	buttonLogin: HTMLButtonElement | null;

	inputInstances: InputControl[];
	inputsErrors: Record<string, string> | null;
	errorMessage: HTMLElement | null;

	constructor({ element, class: blockClass, dispatch }: MAPassRecoveryControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;

		this.buttonBack = this.block.querySelector(`.${blockClass}__button-back`);
		this.buttonSubmit = this.block.querySelector('[type = "submit"]');
		this.buttonSignUp = this.block.querySelector('.js-signup');
		this.buttonLogin = this.block.querySelector('.js-login');

		this.inputInstances = [];
		this.errorMessage;

		this.#init();
	}

	#init() {
		this.#initButtons();
		this.#initInputs();
		this.#initSubmitButton();
		this.#initSubmit();
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

			if (!valid) {
				this.buttonSubmit?.removeAttribute('disabled');
				return;
			}

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
						const phoneOrEmail: HTMLInputElement | null = form.querySelector(
							'input[data-validation-type="phoneOrEmail"]'
						);
						const phoneOrEmailValue = phoneOrEmail?.value;
						const isEmailValue = phoneOrEmailValue?.includes('@');

						this.dispatch({
							type: ActionType.SHOW_CODE,
							payload: {
								type: isEmailValue ? MACodeType.PASS_RECOVERY_EMAIL : MACodeType.PASS_RECOVERY_SMS,
								source: phoneOrEmailValue,
								userId: data.userId,
								urlCode: form.getAttribute('data-url-code'),
								urlCodeResend: form.getAttribute('data-url-code-resend'),
							},
						});
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

	#initButtons() {
		this.buttonBack?.addEventListener('click', () => this.dispatch({ type: ActionType.SHOW_LOGIN }));
		this.buttonSignUp?.addEventListener('click', () => this.dispatch({ type: ActionType.SHOW_SIGN_UP }));
		this.buttonLogin?.addEventListener('click', () => this.dispatch({ type: ActionType.SHOW_LOGIN }));
	}

	#initInputs() {
		this.inputInstances = InputArray(this.block);
		this.inputsErrors = this.#collectDefaultInputsErrors();
		this.#initInputObservers(this.inputsErrors);
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

	show() {
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	hide() {
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
	}
}

export function MAPassRecovery(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-pass-recovery';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MAPassRecoveryControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
