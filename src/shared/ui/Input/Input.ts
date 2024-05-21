import IMask, { InputMask, Masked } from 'imask';

interface InputValidStrategy {
	input: HTMLInputElement;

	isValid(input: HTMLInputElement): boolean;

	setInputValidation(input: HTMLInputElement): void;

	removeInputValidation(): void;
}

export class InputControl {
	CLASS_INPUT_FILLED: string = 'js-filled';
	CLASS_INPUT_ERROR: string = 'js-error';

	block: HTMLElement;
	elementIconClose: HTMLElement | null;
	input: HTMLInputElement | null;
	inputError: HTMLElement | null;
	isFilled: boolean = false;
	private validationStrategy: InputValidStrategy;

	constructor(block: HTMLElement, blockClass: string = '.input') {
		this.block = block;
		this.input = this.block.querySelector(`${blockClass}__field`);
		this.inputError = this.block.querySelector(`${blockClass}__error`);
		this.elementIconClose = this.block.querySelector(`${blockClass}__icon-close`);
		this.#init();
	}

	get getInput() {
		if (!this.input) {
			throw new Error('Input not exist');
		}
		return this.input;
	}

	get getCloseButton() {
		return this.elementIconClose;
	}

	get getIsFilled() {
		return this.isFilled;
	}

	setValidationStrategy(validationStrategy: InputValidStrategy) {
		this.validationStrategy = validationStrategy;
	}

	#init() {
		if (this.input && this.input.dataset.validationType) {
			this.setValidationStrategy(getValidationStrategy(this.input.dataset.validationType, this.input));
			this.#initValidation();
		}
		this.#removeValue();
	}

	#initValidation() {
		if (!this.input) return;

		this.validationStrategy.setInputValidation(this.input);
		this.input.addEventListener('input', () => {
			this.block.classList.remove(this.CLASS_INPUT_ERROR);
			this.checkInputFilled();
		});
	}

	removeValidation() {
		this.validationStrategy.removeInputValidation();
	}

	isValid() {
		if (!this.input) return false;
		const isValid = this.validationStrategy.isValid(this.input);
		if (!isValid) {
			this.block.classList.add(this.CLASS_INPUT_ERROR);
		}
		return isValid;
	}

	checkInputFilled() {
		if (this.input?.value) {
			this.elementIconClose?.classList.remove('d-none');
			this.block.classList.add(this.CLASS_INPUT_FILLED);
			this.isFilled = true;
		} else {
			this.elementIconClose?.classList.add('d-none');
			this.block.classList.remove(this.CLASS_INPUT_FILLED);
			this.isFilled = false;
		}
	}

	setValue(value: string) {
		this.input && (this.input.value = value);
		this.checkInputFilled();
	}

	setError(errors: string[]) {
		if (!this.inputError) return;
		this.inputError.textContent = errors.join('. ');
		this.block.classList.add(this.CLASS_INPUT_ERROR);
	}

	#removeValue() {
		this.elementIconClose?.addEventListener('click', () => this.reset());
	}

	reset() {
		if (this.input) {
			this.input.value = '';
			this.elementIconClose?.classList.add('d-none');
			this.input?.focus();
			this.checkInputFilled();
			this.block.classList.remove(this.CLASS_INPUT_ERROR);
			this.isFilled = false;
		}
	}
}

class InputValidStrategyText implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			input.value = input.value.trim();
			if (!input.value.length) {
				validity = false; // if no value
			} else {
				validity = new RegExp(/[А-яA-z0-9"'”,./ ]+/g).test(input.value);
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		this.input.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
		this.input.value[0] === ' ' && (this.input.value = '');
		this.input.value = this.input.value.replace(/[^А-яA-z0-9"'”“,./ ]/g, '');
	};
}

class InputValidStrategyInn implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			if (!input.value) {
				validity = false; // if no value
			} else if (!input.value.includes('•')) {
				validity = false; // symbol used to create inn from dadata
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		input?.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
		this.input.value = this.input.value.replace(/[^0-9]/g, ''); // only numbers characters
		if (this.input.value.length > 12) {
			this.input.value = this.input.value.slice(0, 12); // not more than 12 characters
		}
	};
}

class InputValidStrategyKpp implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			const regular = /^\d{9}?$/;
			if (!input.value) {
				validity = false; // if no value
			} else if (!regular.test(String(input.value))) {
				validity = false; // if first 9 characters are not numbers
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		input?.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
		this.input.value = this.input.value.replace(/[^0-9]/g, ''); // only numbers characters
		if (this.input.value.length > 9) {
			this.input.value = this.input.value.slice(0, 9); // not more than 9 characters
		}
	};
}

class InputValidStrategyOgrn implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			const regular = /^\d{13}?$/;
			if (!input.value) {
				validity = false; // if no value
			} else if (!regular.test(String(input.value))) {
				validity = false; // if first 13 characters are not numbers
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		input?.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
		this.input.value = this.input.value.replace(/[^0-9]/g, ''); // only numbers characters
		if (this.input.value.length > 13) {
			this.input.value = this.input.value.slice(0, 13); // not more than 13 characters
		}
	};
}

class InputValidStrategyEmail implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			const regular = /^[0-9a-z_.-]+@[0-9a-z_.-]+\.[a-z]{2,}$/i;

			if (!this.input.value) {
				validity = false; // if no value
			} else if (!regular.test(String(this.input.value).toLowerCase())) {
				validity = false; // check email regular
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		//input?.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		//this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
	};
}

class InputValidStrategyFullName implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			validity = new RegExp('[А-яA-z]').test(input.value);
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		input?.addEventListener('input', this.#handleInput);
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;

		this.input.value = this.input.value.replace(/^\s+|[^A-ZА-ЯЁ\s]/gi, '');
	};
}

class InputValidStrategyPhone implements InputValidStrategy {
	input: HTMLInputElement;
	mask: InputMask | null;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			return new RegExp('[0-9]{11}').test(this.mask!.unmaskedValue);
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		this.mask = IMask(this.input, {
			mask: '+{7} (000) 000-00-00',
		});
	}

	removeInputValidation() {
		//this.input.removeEventListener('input', this.#handleInput);
		this.mask && this.mask.destroy();
		this.mask = null;
	}
}

class InputValidStrategyPhoneOrEmail implements InputValidStrategy {
	input: HTMLInputElement;
	mask: InputMask | null;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		const phoneRegular = /(\+7)[ ]\([0-9][0-9][0-9]\)[ ][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/;
		const emailRegular = /^[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}$/i;

		if (input) {
			let validity = true;
			if (
				!phoneRegular.test(String(this.input.value).toLowerCase()) &&
				!emailRegular.test(String(this.input.value).toLowerCase())
			) {
				// check phone and email regular
				validity = false;
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
		this.mask = IMask(this.input, {
			mask: [
				{
					mask: '+7 (000) 000-00-00',
					startsWith: '+7',
				},
				{
					mask: '+7 (000) 000-00-00',
					startsWith: '7',
				},
				{
					mask: '+{7} (000) 000-00-00',
					country: 'Russia',
					startsWith: '8',
					prepare: (appended: string, masked: Masked<any>) => {
						if (appended === '8' && masked.value === '') {
							return '7';
						}
						return appended;
					},
				},
				{
					mask: /^\S*@?\S*$/,
				},
			],
		});
	}

	removeInputValidation() {
		this.mask && this.mask.destroy();
		this.mask = null;
	}
}

class InputValidStrategyPassword implements InputValidStrategy {
	input: HTMLInputElement;

	constructor(input: HTMLInputElement) {
		this.input = input;
	}

	isValid(input: HTMLInputElement): boolean {
		if (!input.required && !input.value) {
			return true;
		}
		if (input) {
			let validity = true;
			input.value = input.value.trim();
			if (!input.value.length) {
				validity = false; // if no value
			}
			return validity;
		}
		return false;
	}

	setInputValidation(input: HTMLInputElement): void {
		this.input = input;
	}

	removeInputValidation() {
		this.input.removeEventListener('input', this.#handleInput);
	}

	#handleInput = () => {
		if (!this.input?.value) return;
	};
}

const getValidationStrategy = (validationType: string, input: HTMLInputElement) => {
	switch (validationType) {
		case 'text':
			return new InputValidStrategyText(input);
		case 'inn':
			return new InputValidStrategyInn(input);
		case 'email':
			return new InputValidStrategyEmail(input);
		case 'fullName':
			return new InputValidStrategyFullName(input);
		case 'phone':
			return new InputValidStrategyPhone(input);
		case 'kpp':
			return new InputValidStrategyKpp(input);
		case 'ogrn':
			return new InputValidStrategyOgrn(input);
		case 'phoneOrEmail':
			return new InputValidStrategyPhoneOrEmail(input);
		case 'password':
			return new InputValidStrategyPassword(input);
		default:
			throw new Error(
				`There is no validation for this data type. Validation strategy [${validationType}] was obtained`
			);
	}
};

export function Input(block: HTMLElement) {
	const blockClass: string = '.input';
	const elem: HTMLElement | null = block.querySelector(`${blockClass}`);

	if (!elem) return null;
	return new InputControl(elem, blockClass);
}

export function InputArray(block: HTMLElement) {
	const blockClass: string = '.input';
	const elems: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);
	const arrInputInstance: InputControl[] = [];

	elems.forEach((elem) => {
		arrInputInstance.push(new InputControl(elem, blockClass));
	});

	return arrInputInstance;
}
