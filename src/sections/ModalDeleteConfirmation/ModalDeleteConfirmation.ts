import { ModalControl } from '../../shared';

export class ModalDeleteConfirmationControl extends ModalControl {
	block: HTMLElement;
	modal: ModalControl;
	body: HTMLElement | null;
	_companyId: string | null;
	apiLink: string | null;
	buttonDelete: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		super(block);

		this.block = block;
		this.body = document.querySelector('body');
		this.buttonDelete = this.block.querySelector(`${blockClass}__button-delete`);

		this.#init();
	}

	set companyId(companyId: string) {
		this._companyId = companyId;
	}

	#init() {
		this.#bindOpenButtons();
		this.#bindDeleteButton();
	}

	#bindOpenButtons() {
		super.getOpenButtonArr.forEach((openButton) => {
			openButton.addEventListener('click', (e: Event) => {
				e.preventDefault();

				this.apiLink = openButton.getAttribute('data-api-url');
			});
		});
	}

	#bindDeleteButton() {
		this.buttonDelete?.addEventListener('click', () => {
			this._companyId && this.#apiFetch(this._companyId);
		});
	}

	#apiFetch(companyId: string) {
		this.apiLink &&
			fetch(this.apiLink, {
				method: 'DELETE',
				body: JSON.stringify({ companyId }),
			}).then((response) => {
				if (response.status === 200) {
					const deleteCompanyEvent = new CustomEvent('deleteCompanyEvent', {
						detail: { companyId },
					});
					document.querySelector('.company-info')?.dispatchEvent(deleteCompanyEvent);
					super.closeModal();
				}
			});
	}

	rebindModalDeleteConfirmationButtons() {
		super.rebindModalOpenButtonsByTag();
		this.#bindOpenButtons();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-delete-confirmation';
	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	if (element) {
		const el = element as IModalDeleteConfirmation;
		el.modalDeleteConfirmation = new ModalDeleteConfirmationControl(element, BLOCK_CLASS);
	}
});

export interface IModalDeleteConfirmation extends HTMLElement {
	modalDeleteConfirmation: ModalDeleteConfirmationControl;
}
