interface MASuccessControlOptions {
	element: HTMLElement;
	class: string;
	dispatch: (action: any) => void;
}

export class MASuccessControl {
	CLASS_DISPLAY_NONE: string = 'd-none';

	block;
	blockClass;
	dispatch;

	button: HTMLButtonElement | null;

	constructor({ element, class: blockClass, dispatch }: MASuccessControlOptions) {
		this.block = element;
		this.blockClass = blockClass;
		this.dispatch = dispatch;
	}

	show() {
		this.block.classList.remove(this.CLASS_DISPLAY_NONE);
	}

	hide() {
		this.block.classList.add(this.CLASS_DISPLAY_NONE);
	}
}

export function MASuccess(block: HTMLElement, dispatch: (action: any) => void) {
	const BLOCK_CLASS = 'ma-success';
	const element: HTMLElement | null = block.querySelector(`.${BLOCK_CLASS}`);

	if (element) {
		return new MASuccessControl({ element, class: BLOCK_CLASS, dispatch });
	}
}
