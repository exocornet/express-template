export class InputOtpControl {
	CLASS_INPUT_ERROR: string = 'js-error';
	KEY_BACKSPACE: string = 'Backspace';
	KEY_ARROW_LEFT: string = 'ArrowLeft';
	KEY_ARROW_RIGHT: string = 'ArrowRight';

	block: HTMLElement;
	blockClass: string;
	inputs: NodeListOf<HTMLInputElement>;
	error: HTMLInputElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.blockClass = blockClass;
		this.inputs = this.block.querySelectorAll(`.${blockClass}__cell`);
		this.error = this.block.querySelector(`.${blockClass}__error`);

		this.#init();
	}

	#init() {
		this.#initInput();
		this.#addEvent();
	}

	#initInput() {
		this.inputs.forEach((input, index) => {
			input.addEventListener('input', () => {
				const currentInput = input;
				const nextInput = currentInput.nextElementSibling as HTMLInputElement;

				currentInput.value = currentInput.value.replace(/[^0-9]/g, '');

				if (currentInput.value.length > 1) {
					currentInput.value = currentInput.value.slice(-1);
				}

				if (nextInput && currentInput.value) {
					nextInput.focus();
				}
			});

			input.addEventListener('paste', (e: ClipboardEvent) => {
				e.preventDefault();
				const pasteData = e.clipboardData
					?.getData('text/plain')
					.split('')
					.filter((char) => /\d/.test(char));
				if (!pasteData?.length) return;
				this.inputs.forEach((input, inputIndex) => {
					if (inputIndex < index) return;
					const value = pasteData.shift();
					value && (input.value = value);
				});
			});

			input.addEventListener('keydown', (e) => {
				const previousInput = input.previousElementSibling as HTMLInputElement;
				const nextInput = input.nextElementSibling as HTMLInputElement;

				if (e.key === this.KEY_BACKSPACE) {
					e.preventDefault();
					if ((e.target as HTMLInputElement)?.value) {
						(e.target as HTMLInputElement).value = '';
					} else {
						previousInput && (previousInput.value = '');
					}
					previousInput && previousInput.focus();
				} else if (e.key === this.KEY_ARROW_LEFT) {
					e.preventDefault();
					previousInput && previousInput.focus();
				} else if (e.key === this.KEY_ARROW_RIGHT) {
					e.preventDefault();
					nextInput && nextInput.focus();
				}
			});
		});
	}

	#addEvent() {
		const inputOtpReadyEvent = (value: string) =>
			new CustomEvent('inputOtpReadyCustom', { bubbles: true, detail: { value } });

		const checkInputsFilled = () => {
			let areInputsFilled = true;

			this.inputs.forEach((inputField) => {
				if (inputField.value.trim() === '') {
					areInputsFilled = false;
				}
			});

			if (!areInputsFilled) return;
			const value = Array.from(this.inputs)
				.map(({ value }) => value)
				.join('');
			this.block.dispatchEvent(inputOtpReadyEvent(value));
		};

		this.inputs.forEach((inputField) => {
			inputField.addEventListener('input', checkInputsFilled);
			inputField.addEventListener('paste', checkInputsFilled);
		});
	}

	focus() {
		setTimeout(() => {
			this.inputs[0].focus();
		}, 100);
	}

	reset() {
		this.block.classList.remove(this.CLASS_INPUT_ERROR);
		this.inputs.forEach((input) => (input.value = ''));
		this.focus();
	}

	showError(errorText: string) {
		this.error && (this.error.innerHTML = errorText);
		this.block.classList.add(this.CLASS_INPUT_ERROR);
	}
}

export function InputOtp(block: HTMLElement) {
	const BLOCK_CLASS = 'input-otp';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new InputOtpControl(element, BLOCK_CLASS);
	}
}
