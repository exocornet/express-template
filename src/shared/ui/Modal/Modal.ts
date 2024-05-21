export class ModalControl {
	CLASS_SHOW: string = 'js-show';
	KEY_ESC: string = 'Escape';
	ATTRIBUTE_BUTTON: string = 'data-modal-form';
	ATTRIBUTE_FORM: string = 'data-modal';
	CLASS_OVERFLOW: string = 'js-body-hidden-scrollbar';

	block: HTMLElement;
	blockClass: string;
	modalName: string | null;
	pageBody: HTMLElement | null;
	private background: HTMLElement | null;
	body: HTMLElement | null;
	private openButtons: Array<any>;
	private buttonClose: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string = '.modal') {
		this.block = block;
		this.blockClass = blockClass;
		this.modalName = this.block.dataset.modal || null;
		this.pageBody = document.querySelector('body');
		this.background = this.block.querySelector(`${blockClass}__bg`);
		this.openButtons = Array.from(document.querySelectorAll(`[${this.ATTRIBUTE_BUTTON}=${this.modalName}]`));
		this.buttonClose = this.block.querySelector(`${blockClass}__button-close`);
		this.#init();
	}

	get getOpenButtonArr() {
		return this.openButtons;
	}

	get getCloseButton() {
		return this.buttonClose;
	}

	get getBackground() {
		return this.background;
	}

	#init() {
		this.#bindOpenModalButtons();
		this.#initModalClose();
	}

	//## Открытие модального окна ##//
	#bindOpenModalButtons() {
		if (!this.openButtons.length) return;

		this.openButtons.forEach((openButton) => {
			openButton.addEventListener('click', this.#handleOpenModal);
		});
	}

	#handleOpenModal = () => {
		this.#showModal(this.block);
	};

	#showModal(modal: Element) {
		this.pageBody?.classList.add(this.CLASS_OVERFLOW);
		modal.classList.add(this.CLASS_SHOW);
	}

	showModalInstance(modal?: Element) {
		if (modal) {
			this.#showModal(modal);
		} else {
			this.#showModal(this.block);
		}
	}

	//## Закрытие модального окна ##//
	#hideModal() {
		this.pageBody?.classList.remove(this.CLASS_OVERFLOW);
		this.block.classList.remove(this.CLASS_SHOW);

		const closeModalEvent = new Event('modalCloseCustom');
		this.block.dispatchEvent(closeModalEvent);
	}

	#initModalClose() {
		this.#closeModalBtn();

		//## Закрытие при нажатии вне модалки ##//
		this.background?.addEventListener('click', () => {
			this.#hideModal();
		});

		//## Закрытие на кнопку esc ##//
		document.addEventListener('keydown', (e) => {
			if (e.key == this.KEY_ESC) {
				this.#hideModal();
			}
		});
	}

	#closeModalBtn() {
		//## Закрытие на кнопку ##//
		this.buttonClose?.addEventListener('click', () => {
			this.#hideModal();
		});
	}

	rebindClose(block: HTMLElement) {
		this.buttonClose = block.querySelector(`${this.blockClass}__button-close`);

		this.#closeModalBtn();
	}

	closeModal() {
		this.pageBody?.classList.remove(this.CLASS_OVERFLOW);
		this.block.classList.remove(this.CLASS_SHOW);
	}

	//## Добавление кнопок ##//
	addModalOpenButtons(openButtons: any[]) {
		if (openButtons[0] && openButtons[0].getAttribute('data-modal-form')) {
			openButtons.forEach((openButton) => {
				openButton.addEventListener('click', () => this.#showModal(this.block));
				this.openButtons.push(openButton);
			});
		} else {
			openButtons.forEach((openButton) => {
				const button: HTMLLinkElement | null = openButton.querySelector('[data-modal-form]');
				if (button) {
					button.addEventListener('click', () => this.#showModal(this.block));
					this.openButtons.push(openButton);
				}
			});
		}
	}

	//## Переназначение кнопок ##//
	rebindModalOpenButtonsByTag() {
		this.removeAllModalOpenButtons();
		this.openButtons = Array.from(document.querySelectorAll(`[${this.ATTRIBUTE_BUTTON}=${this.modalName}]`));
		this.#bindOpenModalButtons();
	}

	rebindModalOpenButtons(openButtons: any[]) {
		this.removeAllModalOpenButtons();
		this.openButtons.push(...openButtons);
		this.#bindOpenModalButtons();
	}

	//## Удаление кнопок ##//
	removeModalOpenButtons(openButtons: any[]) {
		openButtons.forEach((openButton) => {
			const index = this.getOpenButtonArr.findIndex((item) => item === openButton);
			if (index > -1) {
				this.getOpenButtonArr.splice(index, 1);
			}
		});
	}

	removeAllModalOpenButtons() {
		this.openButtons.forEach((openButton) => {
			openButton.removeEventListener('click', this.#handleOpenModal);
		});
		this.openButtons = [];
	}
}

export function Modal(block: HTMLElement) {
	const BLOCK_CLASS = '.modal';

	return new ModalControl(block, BLOCK_CLASS);
}
