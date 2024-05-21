import { ModalControl, Slider } from '../../shared';
import { CardProduct } from '../../components/CardProduct/CardProduct';
import { HiddenText } from '../../components/HiddenText/HiddenText';
import { HiddenList } from '../../components/HiddenList/HiddenList';
import { CardPrice } from '../../components/CardPrice/CardPrice';
import { GetCartStateManager } from '../../shared/ui/CartStateManager/CartStateManager';

class ModalProductControl extends ModalControl {
	block: HTMLElement;
	modalBody: HTMLElement | null;
	pagePathname: string;
	dataIdComponent: string;
	KEY_ESC: string = 'Escape';

	constructor(block: HTMLElement) {
		super(block, '.modal');

		this.block = block;
		this.modalBody = this.block.querySelector('.modal__body');
		this.pagePathname = new URL(window.location.href).pathname;

		this.dataIdComponent = this.block.dataset.idComponent || '';

		this.#init();
	}

	#init() {
		this.#onOpen(super.getOpenButtonArr);
		this.#onClose();

		this.#initModalItems();
	}

	#initModalItems() {
		if (this.modalBody) {
			CardProduct(this.modalBody);
			CardPrice(this.modalBody);
			HiddenText(this.modalBody);
			HiddenList(this.modalBody);
			Slider(this.modalBody);
		}
	}

	#onClose() {
		this.block.addEventListener('modalCloseCustom', () => {
			this.#clearHashModalOnAutomaticOpened();
			const cardProductArr: HTMLLinkElement[] = Array.from(this.block.querySelectorAll('.card-product'));
			const cardPrice: HTMLElement | null = this.block.querySelector('.card-price');
			if (cardProductArr && cardPrice) {
				const unsubArr = [...cardProductArr, cardPrice];

				GetCartStateManager().unsubscribeArr(unsubArr);
				this.#removeOldModalOpenButton();
			}
		});
	}

	#onOpen(openButtons: Array<HTMLLinkElement>) {
		let urlFetch = new URL(window.location.href).pathname;
		let newControlButtons: HTMLLinkElement[] = [];

		if (openButtons[0] && openButtons[0].getAttribute('data-modal-form')) {
			newControlButtons = openButtons;
		} else {
			openButtons.forEach((openButton) => {
				const button: HTMLLinkElement | null = openButton.querySelector('[data-modal-form]');
				button && newControlButtons.push(button);
			});
		}

		newControlButtons.forEach((newControlButton: HTMLLinkElement) => {
			newControlButton.addEventListener('click', () => {
				const productLink = newControlButton.getAttribute('href');
				urlFetch = productLink || '';
				window.history.pushState({}, '', urlFetch);

				productLink && this.#fetchData(productLink);
			});
		});
	}

	#clearHashModalOnAutomaticOpened() {
		this.pagePathname.includes('catalog/product')
			? history.pushState({}, document.title, '/catalog')
			: history.replaceState({}, document.title, this.pagePathname);
	}

	#fetchData(productLink: string) {
		fetch(productLink, {
			method: 'GET',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-Component': this.dataIdComponent,
			},
		})
			.then((response) => response.text())
			.then((data) => {
				// подставлять верстку в модалку
				if (this.modalBody) {
					this.#removeOldModalOpenButton();
					this.modalBody.innerHTML = data;

					CardProduct(this.modalBody);
					CardPrice(this.modalBody);
					HiddenText(this.modalBody);
					HiddenList(this.modalBody);
					Slider(this.modalBody);

					this.addModalProductOpenButton(this.modalBody.querySelectorAll('[data-modal-form]'));
					super.rebindClose(this.modalBody);
				}
			});
	}

	#removeOldModalOpenButton() {
		const cardProductArr: HTMLLinkElement[] = Array.from(this.block.querySelectorAll('.card-product'));
		super.removeModalOpenButtons(cardProductArr);
	}

	addModalProductOpenButton(openButtons: NodeListOf<HTMLLinkElement>) {
		const btn: HTMLLinkElement[] = Array.from(openButtons);

		super.addModalOpenButtons(btn);
		this.#onOpen(btn);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-product';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	if (element) {
		const el = element as IModalProduct;
		el.modalProduct = new ModalProductControl(element);
	}
});

export interface IModalProduct extends HTMLElement {
	modalProduct: ModalProductControl;
}
