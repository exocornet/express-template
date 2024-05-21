import { Modal, ModalControl } from '../../shared';

class ModalMapControl extends ModalControl {
	block: HTMLElement;
	modal: ModalControl;
	modalBody: HTMLElement | null;
	KEY_ESC: string = 'Escape';

	constructor(block: HTMLElement) {
		super(block);

		this.block = block;
		this.modal = Modal(this.block);
		this.modalBody = this.block.querySelector('.modal__body');

		this.init();
	}

	init() {}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-map-static';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	element && new ModalMapControl(element);
});
