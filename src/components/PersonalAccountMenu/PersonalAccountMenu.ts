class PersonalAccountMenuControl {
	block: HTMLElement;
	personalAccountButton: HTMLElement | null;

	constructor(block: HTMLElement) {
		this.block = block;
		this.personalAccountButton = document.querySelector('.header__sign-in');

		this.#init();
	}

	#init() {
		//this.#createNavigationMenu();
		this.#bindButton();
	}

	#bindButton() {
		this.personalAccountButton?.addEventListener('click', () => {
			this.personalAccountButton?.classList.toggle('js-personal-account-active');
			this.block?.classList.toggle('d-none');
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.personal-account-menu';
	const element: HTMLElement | null = document.querySelector(BLOCK_CLASS);

	element && new PersonalAccountMenuControl(element);
});
