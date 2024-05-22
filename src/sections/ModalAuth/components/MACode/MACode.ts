import { InputOtp, InputOtpControl } from '../../../../shared/ui';
import { ActionType } from '../../ModalAuth';

interface MACodeControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

interface MACodePayload {
	type: string;
	source: string;
	userId: string;
	urlCode: string;
	urlCodeResend: string;
}

export const MACodeType = {
	SIGN_UP_SMS: 'SIGN_UP_SMS',
	SIGN_UP_EMAIL: 'SIGN_UP_EMAIL',
	PASS_RECOVERY_SMS: 'PASS_RECOVERY_SMS',
	PASS_RECOVERY_EMAIL: 'PASS_RECOVERY_EMAIL',
};

export class MACodeControl {
	CLASS_DISPLAY_NONE: string = 'd-none';
	COUNTDOWN_TIME: number = 60;

	block;
	blockClass;
	dispatch;

	heading: HTMLElement | null;
	text: HTMLElement | null;
	caption: HTMLElement | null;
	inputOtp: InputOtpControl | undefined;
	buttonResend: HTMLButtonElement | null;
	type: string | null;
	userId: string | null;
	urlCode: string | null;
	urlCodeResend: string | null;
	countdownInterval: NodeJS.Timeout;
	errorMessage: HTMLElement | null;

	constructor({ element, class: blockClass, dispatch }: MACodeControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;

		this.heading = this.block.querySelector(`.${blockClass}__heading`);
		this.text = this.block.querySelector(`.${blockClass}__text`);
		this.caption = this.block.querySelector(`.${blockClass}__caption-act`);
		this.inputOtp = InputOtp(this.block);
		this.buttonResend = this.block.querySelector('.js-resend');
		this.errorMessage;

		this.#init();
	}

	#init() {
		this.#initButtons();
		this.#initInputOtp();
	}

	#initButtons() {
		this.buttonResend?.addEventListener('click', (e) => {
			e.preventDefault();
			this.inputOtp?.reset();
			this.#removeErrorMessage();

			const formData = new FormData();
			this.userId && formData.append('userId', this.userId);

			fetch(this.urlCodeResend as string, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.errorMessage) {
						this.#showErrorMessage(data.errorMessage);
					} else {
						this.#initButtonResendCounter();
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
		});
	}

	#initInputOtp() {
		this.block.addEventListener('inputOtpReadyCustom', (e) => {
			const code = (e as CustomEvent).detail.value;
			const formData = new FormData();
			this.userId && formData.append('userId', this.userId);
			formData.append('code', code);

			fetch(this.urlCode as string, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.errorMessage) {
						// TODO: уточнить у бэка, в каком поле будут приходить ошибки. Сейчас беру из data.errorMessage
						this.inputOtp?.showError(data.errorMessage);
					} else {
						if (this.type === MACodeType.SIGN_UP_SMS || this.type === MACodeType.SIGN_UP_EMAIL) {
							this.dispatch({ type: ActionType.SHOW_SUCCESS });
							setTimeout(() => {
								location.reload();
							}, 2000);
						} else if (this.type === MACodeType.PASS_RECOVERY_SMS) {
							this.dispatch({
								type: ActionType.SHOW_PASS_CHANGE,
								payload: {
									userId: this.userId,
									code: code,
								},
							});
						}
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
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

			this.buttonResend?.before(errorMessage);
		}
	}

	#removeErrorMessage() {
		if (!this.errorMessage) return;
		this.errorMessage.classList.add(this.CLASS_DISPLAY_NONE);
	}

	#initButtonResendCounter() {
		if (!this.buttonResend) return;

		let countdownTime = this.COUNTDOWN_TIME;

		const startCountdown = () => {
			this.buttonResend && (this.buttonResend.disabled = true);

			this.countdownInterval = setInterval(() => {
				countdownTime--;
				const buttonText = this.buttonResend?.querySelector('.button__text');
				buttonText && (buttonText.textContent = `Отправить повторно ${this.#formatSeconds(countdownTime)}`);

				if (countdownTime <= 0) {
					clearInterval(this.countdownInterval);
					this.buttonResend && (this.buttonResend.disabled = false);
					countdownTime = this.COUNTDOWN_TIME;
					buttonText && (buttonText.textContent = 'Отправить повторно');
				}
			}, 1000);
		};
		startCountdown();
	}

	#setHeading({ type }: { type: string }) {
		if (!this.heading) return;

		switch (type) {
			case MACodeType.SIGN_UP_SMS:
				this.heading.textContent = 'Код из СМС';
				break;
			case MACodeType.SIGN_UP_EMAIL:
				this.heading.textContent = 'Код из письма';
				break;
			case MACodeType.PASS_RECOVERY_SMS:
			case MACodeType.PASS_RECOVERY_EMAIL:
				this.heading.textContent = 'Восстановить пароль';
				break;
			default:
				return true;
		}
	}

	#setText({ type, source }: { type: string; source: string }) {
		if (!this.text) return;

		switch (type) {
			case MACodeType.SIGN_UP_SMS:
			case MACodeType.PASS_RECOVERY_SMS:
				this.text.textContent = `Отправили код подтверждения на номер ${source}`;
				break;
			case MACodeType.SIGN_UP_EMAIL:
				this.text.textContent = `Введите код подтверждения, который мы выслали вам на эл. почту: ${source}`;
				break;
			case MACodeType.PASS_RECOVERY_EMAIL:
				this.text.textContent = `Отправили ссылку на создание нового пароля на ${source}`;
				break;
			default:
				return true;
		}
	}

	#setInputOtp({ type }: { type: string }) {
		const inputOtp = this.block.querySelector(`.${this.blockClass}__input-otp`);
		if (!inputOtp) return;

		switch (type) {
			case MACodeType.SIGN_UP_SMS:
			case MACodeType.SIGN_UP_EMAIL:
			case MACodeType.PASS_RECOVERY_SMS:
				inputOtp.classList.remove(this.CLASS_DISPLAY_NONE);
				break;
			case MACodeType.PASS_RECOVERY_EMAIL:
				inputOtp.classList.add(this.CLASS_DISPLAY_NONE);
				break;
			default:
				return true;
		}
	}

	#setCaption({ type }: { type: string }) {
		if (!this.caption) return;

		switch (type) {
			case MACodeType.SIGN_UP_SMS:
			case MACodeType.SIGN_UP_EMAIL:
				this.caption.textContent = 'регистрацию';
				break;
			case MACodeType.PASS_RECOVERY_SMS:
			case MACodeType.PASS_RECOVERY_EMAIL:
				this.caption.textContent = 'восстановление пароля';
				break;
			default:
				return true;
		}
	}

	#formatSeconds(time: number) {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	show({ type, source, userId, urlCode, urlCodeResend }: MACodePayload) {
		this.type = type;
		this.userId = userId;
		this.urlCode = urlCode;
		this.urlCodeResend = urlCodeResend;

		this.#setHeading({ type });
		this.#setText({ type, source });
		this.#setInputOtp({ type });
		this.#setCaption({ type });
		this.inputOtp?.focus();
		this.#initButtonResendCounter();
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	resetData() {
		this.type = null;
		this.userId = null;
		this.urlCode = null;
		this.urlCodeResend = null;
		clearInterval(this.countdownInterval);
	}

	hide() {
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
		this.inputOtp?.reset();
		const buttonText = this.buttonResend?.querySelector('.button__text');
		buttonText && (buttonText.textContent = `Отправить повторно ${this.#formatSeconds(this.COUNTDOWN_TIME)}`);
		this.resetData();
	}
}

export function MACode(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-code';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MACodeControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
