import { InputArray, InputControl } from '../../../../shared/ui';
import { useDebounce } from '../../../../shared/helpers/js/useDebounce';
import { ActionType } from '../../ModalAuth';
import { MACodeType } from '../MACode/MACode';
import { InputInn, InputInnControl } from '../../../../shared/ui/InputInn/InputInn';

interface MASignUpControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

export class MASignUpControl {
	CLASS_DISPLAY_NONE: string = 'd-none';
	CLASS_INPUT_ERROR: string = 'js-error';
	CLASS_TABS_BUTTON_ACTIVE = 'js-tabs-button-active';
	CLASS_TABS_CONTENT_ACTIVE = 'js-tabs-content-active';

	block;
	blockClass;
	dispatch;

	buttonLogin: HTMLButtonElement | null;

	inputInstances: InputControl[][];
	inputsErrors: (Record<string, string> | null)[];
	errorMessages: HTMLElement[];
	inputInnInstances: InputInnControl[];

	constructor({ element, class: blockClass, dispatch }: MASignUpControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;

		this.buttonLogin = this.block.querySelector('.js-login');

		this.inputInstances = [];
		this.inputsErrors = [];
		this.errorMessages = [];

		this.#init();
	}

	#init() {
		this.#initButtons();
		this.#initInputs();
		this.#initSubmitButtons();
		this.#initSubmit();
	}

	#initButtons() {
		this.buttonLogin?.addEventListener('click', () => this.dispatch({ type: ActionType.SHOW_LOGIN }));
	}

	#initInputs() {
		const forms = this.block.querySelectorAll('form');

		forms.forEach((form, index) => {
			this.inputInstances.push(InputArray(form));
			this.inputsErrors.push(this.#collectDefaultInputsErrors(form));
			this.#initInputObservers(form, this.inputsErrors[index]);
		});

		this.inputInnInstances = InputInn(this.block);
	}

	#initSubmitButtons() {
		const forms: NodeListOf<HTMLFormElement> | undefined = this.block.querySelectorAll('form');
		if (!forms) return;

		forms.forEach((form) => {
			const buttonSubmit: HTMLButtonElement | null = form.querySelector('[type = "submit"]');
			const inputFields: NodeListOf<HTMLInputElement> | undefined = form.querySelectorAll('.input__field[required]');

			const checkInputsFilled = () => {
				let areInputsFilled = true;

				inputFields.forEach((inputField) => {
					if (inputField.value.trim() === '') {
						areInputsFilled = false;
					}
				});

				buttonSubmit && (buttonSubmit.disabled = !areInputsFilled);
			};

			inputFields.forEach((inputField) => {
				const input = inputField.closest('.input');
				input?.addEventListener('click', checkInputsFilled);
				inputField.addEventListener('input', checkInputsFilled);
			});
		});
	}

	#initSubmit() {
		const forms = this.block.querySelectorAll('form');
		if (!forms.length) return;

		const handleSubmit = ({ form, index }: { form: HTMLFormElement; index: number }) => {
			const buttonSubmit: HTMLButtonElement | null = form.querySelector('[type = "submit"]');
			buttonSubmit?.setAttribute('disabled', 'disabled');

			let valid = true;

			this.inputInstances[index]?.forEach((inputInstance) => {
				if (!inputInstance.isValid()) {
					valid = false;
				}
			});

			const isEqualPasswords = this.#comparePasswords(form);
			if (!isEqualPasswords) {
				valid = false;
			}

			if (!valid) {
				buttonSubmit?.removeAttribute('disabled');
				return;
			}

			const options: RequestInit = {
				method: form.method,
				credentials: 'include',
			};

			const body = new FormData(form as HTMLFormElement);
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
			form.method.toUpperCase() === 'POST' && (options.body = body);

			fetch(form.action, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.errors) {
						this.#showNewInputsErrors(form, data.errors);
					}
					if (data.errorMessage) {
						this.#showErrorMessage(data.errorMessage, buttonSubmit, index);
					} else {
						let email;
						let phone;
						const phoneRegular = /(\+7)[ ]\([0-9][0-9][0-9]\)[ ][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/;
						const emailRegular = /[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}/i;

						(options?.body as FormData)?.forEach((value) => {
							if (phoneRegular.test(String(value).toLowerCase())) {
								phone = value;
							} else if (emailRegular.test(String(value).toUpperCase())) {
								email = value;
							}
						});

						this.dispatch({
							type: ActionType.SHOW_CODE,
							payload: {
								type: email ? MACodeType.SIGN_UP_EMAIL : MACodeType.SIGN_UP_SMS,
								source: phone || email,
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
				})
				.finally(() => {
					buttonSubmit?.removeAttribute('disabled');
				});
		};
		const debouncedHandleSubmit = useDebounce(handleSubmit, 250);

		forms.forEach((form, index) => {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				this.#removeErrorMessage(index);
				debouncedHandleSubmit({ form, index });
			});
		});
	}

	#showErrorMessage(message: string, buttonSubmit: HTMLElement | null, index: number) {
		if (this.errorMessages[index]) {
			this.errorMessages[index].textContent = message;
			this.errorMessages[index].classList.remove(this.CLASS_DISPLAY_NONE);
		} else {
			const errorMessage = document.createElement('span');
			errorMessage.classList.add('text', 'text_caption', 'text_red', 'modal-auth__error');
			errorMessage.textContent = message;
			this.errorMessages[index] = errorMessage;

			buttonSubmit?.before(errorMessage);
		}
	}

	#removeErrorMessage(index: number) {
		if (!this.errorMessages[index]) return;
		this.errorMessages[index].classList.add(this.CLASS_DISPLAY_NONE);
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

	#showNewInputsErrors(inputsBlock: HTMLElement | null, errorsObject: Record<string, string[]>) {
		Object.entries(errorsObject).map(([name, errors]) => {
			const inputField = inputsBlock?.querySelector(`[name = ${name}]`);
			const input = inputField?.closest('.input');
			const inputError = input?.querySelector('.input__error');
			inputError && (inputError.textContent = errors.join('. ')) && input?.classList.add(this.CLASS_INPUT_ERROR);
		});
	}

	#collectDefaultInputsErrors(inputsBlock: HTMLElement) {
		const inputs = inputsBlock?.querySelectorAll('.input');
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

	#initInputObservers(inputsBlock: HTMLElement, inputsErrors: Record<string, string> | null) {
		const inputs: NodeListOf<HTMLElement> = inputsBlock?.querySelectorAll('.input');
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

	#resetTabs() {
		const tabsButtons = this.block.querySelectorAll('.tabs__button');
		const tabsContents = this.block.querySelectorAll('.tabs__content');

		tabsButtons.forEach((tabsButton, index) =>
			index === 0
				? tabsButton.classList.add(this.CLASS_TABS_BUTTON_ACTIVE)
				: tabsButton.classList.remove(this.CLASS_TABS_BUTTON_ACTIVE)
		);
		tabsContents.forEach((tabsContent, index) =>
			index === 0
				? tabsContent.classList.add(this.CLASS_TABS_CONTENT_ACTIVE)
				: tabsContent.classList.remove(this.CLASS_TABS_CONTENT_ACTIVE)
		);
	}

	show() {
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	hide() {
		this.#resetTabs();
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
	}
}

export function MASignUp(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-signup';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MASignUpControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
