import { ButtonShowMore } from '../ButtonShowMore/ButtonShowMore';

class HiddenListControl extends ButtonShowMore {
	block: HTMLElement;
	private hiddenList: HTMLElement | null;
	private hiddenListItem: NodeListOf<HTMLElement> | undefined;
	private listOpened: boolean = false;

	constructor(block: HTMLElement, blockClass: string) {
		super(block.querySelector('.button-show-more') as HTMLElement);

		this.block = block;
		this.hiddenList = this.block.querySelector('[data-hidden-list]');
		this.hiddenListItem = this.hiddenList?.querySelectorAll(`${blockClass}__list-item`);

		this.#init();
	}

	#init() {
		this.#bindButton();
		this.#hideListItems();
	}

	#bindButton() {
		super.getButtonShowMore?.addEventListener('click', () => {
			if (this.listOpened) {
				this.listOpened = false;
				this.#hideListItems();
			} else {
				this.listOpened = true;
				this.#showListItems();
			}
		});
	}

	#showListItems() {
		this.hiddenListItem?.forEach((listItem) => {
			listItem.classList.remove('d-none');
		});
	}

	#hideListItems() {
		this.hiddenListItem?.forEach((listItem, pos) => {
			if (pos > 3) {
				listItem.classList.add('d-none');
			}
		});
	}
}

export function HiddenList(block: HTMLElement) {
	const blockClass: string = '.hidden-list';
	const elements: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);

	elements.forEach((element) => {
		new HiddenListControl(element, blockClass);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass = '.hidden-list';
	const ELEMS: NodeListOf<HTMLElement> = document.querySelectorAll(`${blockClass}`);
	ELEMS.forEach((elem) => {
		new HiddenListControl(elem, blockClass);
	});
});
