class CookiesControl {
	block: HTMLElement;
	cookiesButton: HTMLElement | null;
	dataApiUrl: string | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.cookiesButton = block.querySelector(`${blockClass}__button`);
		this.dataApiUrl = this.block.getAttribute('data-api-url');

		this.#init();
	}

	#init(): void {
		this.cookiesButton?.addEventListener('click', () => {
			this.#apiFetch();
		});
	}

	#apiFetch(): void {
		this.dataApiUrl &&
			fetch(this.dataApiUrl, {
				method: 'GET',
			}).then(() => {
				this.block.remove();
			});
	}
}

export function Cookies() {
	const BLOCK_CLASS = '.cookies';
	const element: HTMLElement | null = document.querySelector(BLOCK_CLASS);

	element && new CookiesControl(element, BLOCK_CLASS);
}
