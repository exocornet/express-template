class MenuLk {
	body: HTMLElement | null;
	block: HTMLElement;
	openButton: HTMLElement | null;
	closeButton: HTMLElement | null;
	menuLkFooter: NodeListOf<HTMLElement> | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.body = document.querySelector('body');

		this.block = block;
		this.openButton = document.querySelector('.header__sign-in');
		this.closeButton = this.block.querySelector(`${blockClass}__menu-close`);
		this.menuLkFooter = this.block.querySelector(`${blockClass}__footer`)?.childNodes as NodeListOf<HTMLElement>;

		this.#init();
	}

	#init() {
		if (window.innerWidth < 1280) {
			this.openButton?.addEventListener('click', () => {
				this.body?.classList.add('overflow-hidden');
				this.block.classList.add('js-menu-lk-show');
			});

			this.closeButton?.addEventListener('click', () => {
				this.body?.classList.remove('overflow-hidden');
				this.block.classList.remove('js-menu-lk-show');
			});
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass = '.menu-lk';
	const element: HTMLElement | null = document.querySelector(blockClass);

	element && new MenuLk(element, blockClass);
});
