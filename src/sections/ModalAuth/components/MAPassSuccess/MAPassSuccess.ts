import { ActionType } from '../../ModalAuth';

interface MAPassSuccessControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

export class MAPassSuccessControl {
	CLASS_DISPLAY_NONE: string = 'd-none';

	block;
	blockClass;
	dispatch;

	button: HTMLButtonElement | null;

	constructor({ element, class: blockClass, dispatch }: MAPassSuccessControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;

		this.button = this.block.querySelector(`.${blockClass}__button`);

		this.#init();
	}

	#init() {
		this.#initButtons();
	}

	#initButtons() {
		this.button?.addEventListener('click', () => this.dispatch({ type: ActionType.SHOW_LOGIN }));
	}

	show() {
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	hide() {
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
	}
}

export function MAPassSuccess(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-pass-success';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MAPassSuccessControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
