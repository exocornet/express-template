import { Modal, ModalControl } from '../../shared';
import { MACode, MACodeControl } from './components/MACode/MACode';
import { MALogin, MALoginControl } from './components/MALogin/MALogin';
import { MAPassChange, MAPassChangeControl } from './components/MAPassChange/MAPassChange';
import { MAPassRecovery, MAPassRecoveryControl } from './components/MAPassRecovery/MAPassRecovery';
import { MAPassSuccess, MAPassSuccessControl } from './components/MAPassSuccess/MAPassSuccess';
import { MASignUp, MASignUpControl } from './components/MASignUp/MASignUp';
import { MASuccess, MASuccessControl } from './components/MASuccess/MASuccess';

export const ActionType = {
	SHOW_CODE: 'SHOW_CODE',
	SHOW_LOGIN: 'SHOW_LOGIN',
	SHOW_PASS_CHANGE: 'SHOW_PASS_CHANGE',
	SHOW_PASS_RECOVERY: 'SHOW_PASS_RECOVERY',
	SHOW_PASS_SUCCESS: 'SHOW_PASS_SUCCESS',
	SHOW_SIGN_UP: 'SHOW_SIGN_UP',
	SHOW_SUCCESS: 'SHOW_SUCCESS',
	CLOSE_MODAL: 'CLOSE_MODAL',
};

class ModalAuthControl {
	CLASS_MODAL: string = 'modal';
	CLASS_MODAL_SHOW: string = 'js-show';
	CLASS_MODAL_OVERFLOW: string = 'js-body-hidden-scrollbar';
	CLASS_INPUT_ERROR: string = 'js-error';
	CLASS_INPUT_FILLED: string = 'js-filled';
	CLASS_DISPLAY_NONE: string = 'd-none';

	block: HTMLElement;
	blockClass: string;
	modal: ModalControl;
	code: MACodeControl | undefined;
	login: MALoginControl | undefined;
	passChange: MAPassChangeControl | undefined;
	passRecovery: MAPassRecoveryControl | undefined;
	passSuccess: MAPassSuccessControl | undefined;
	signUp: MASignUpControl | undefined;
	success: MASuccessControl | undefined;
	pageBody: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.blockClass = blockClass;

		this.modal = Modal(this.block);
		this.code = MACode(this.block, this.dispatch.bind(this));
		this.login = MALogin(this.block, this.dispatch.bind(this));
		this.passChange = MAPassChange(this.block, this.dispatch.bind(this));
		this.passRecovery = MAPassRecovery(this.block, this.dispatch.bind(this));
		this.passSuccess = MAPassSuccess(this.block, this.dispatch.bind(this));
		this.signUp = MASignUp(this.block, this.dispatch.bind(this));
		this.success = MASuccess(this.block, this.dispatch.bind(this));
		this.pageBody = document.querySelector('body');

		this.#init();
	}

	#init() {
		this.#onClose();
	}

	#onClose() {
		this.block.addEventListener('modalCloseCustom', () => this.closeModal());
	}

	#reset() {
		const forms = this.block.querySelectorAll('form');
		const inputs = this.block.querySelectorAll('.input');

		forms?.forEach((form) => form.reset());
		inputs?.forEach((input) => {
			const elementIconClose = input.querySelector('.input__icon-close');
			elementIconClose?.classList.add(this.CLASS_DISPLAY_NONE);
			input.classList.remove(this.CLASS_INPUT_FILLED, this.CLASS_INPUT_ERROR);
		});
	}

	dispatch(action: any) {
		switch (action.type) {
			case ActionType.SHOW_CODE:
				this.showCode(action.payload);
				break;
			case ActionType.SHOW_LOGIN:
				this.showLogin();
				break;
			case ActionType.SHOW_PASS_CHANGE:
				this.showPassChange(action.payload);
				break;
			case ActionType.SHOW_PASS_RECOVERY:
				this.showPassRecovery();
				break;
			case ActionType.SHOW_PASS_SUCCESS:
				this.showPassSuccess();
				break;
			case ActionType.SHOW_SIGN_UP:
				this.showSignUp();
				break;
			case ActionType.SHOW_SUCCESS:
				this.showSuccess();
				break;
			case ActionType.CLOSE_MODAL:
				this.closeModal();
				break;
		}
	}

	showCode(payload: any) {
		this.code?.show(payload);
		this.login?.hide();
		this.passChange?.hide();
		this.passRecovery?.hide();
		this.passSuccess?.hide();
		this.signUp?.hide();
		this.success?.hide();
	}

	showLogin() {
		this.login?.show();
		this.code?.hide();
		this.passChange?.hide();
		this.passRecovery?.hide();
		this.passSuccess?.hide();
		this.signUp?.hide();
		this.success?.hide();
	}

	showPassChange(payload: any) {
		this.passChange?.show(payload);
		this.code?.hide();
		this.login?.hide();
		this.passRecovery?.hide();
		this.passSuccess?.hide();
		this.signUp?.hide();
		this.success?.hide();
	}

	showPassRecovery() {
		this.passRecovery?.show();
		this.code?.hide();
		this.login?.hide();
		this.passChange?.hide();
		this.passSuccess?.hide();
		this.signUp?.hide();
		this.success?.hide();
	}

	showPassSuccess() {
		this.passSuccess?.show();
		this.code?.hide();
		this.login?.hide();
		this.passChange?.hide();
		this.passRecovery?.hide();
		this.signUp?.hide();
		this.success?.hide();
	}

	showSignUp() {
		this.signUp?.show();
		this.code?.hide();
		this.login?.hide();
		this.passChange?.hide();
		this.passRecovery?.hide();
		this.passSuccess?.hide();
		this.success?.hide();
	}

	showSuccess() {
		this.success?.show();
		this.code?.hide();
		this.login?.hide();
		this.passChange?.hide();
		this.passRecovery?.hide();
		this.passSuccess?.hide();
		this.signUp?.hide();
	}

	closeModal() {
		this.pageBody?.classList.remove(this.CLASS_MODAL_OVERFLOW);
		this.block.classList.remove(this.CLASS_MODAL_SHOW);
		this.#reset();
		this.showLogin();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-auth';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);
	element && new ModalAuthControl(element, BLOCK_CLASS);
});
