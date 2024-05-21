class TabsControl {
	block: HTMLElement;
	buttons: NodeListOf<Element>;
	contents: NodeListOf<Element>;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.buttons = this.block.querySelectorAll(`${blockClass}__button`);
		this.contents = this.block.querySelectorAll(`${blockClass}__content`);
		this.#init();
	}

	#init() {
		this.#addEvents();
		this.#showContent();
	}

	#addEvents() {
		this.buttons.forEach((button) => {
			(button as HTMLButtonElement).addEventListener('click', (e) => {
				(e.target as HTMLElement).scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
				this.#showContent(button as HTMLButtonElement);
			});
		});
	}

	#showContent(button?: HTMLButtonElement) {
		const currentContent =
			button?.dataset.tabsButton || (this.buttons.item(0) as HTMLButtonElement)?.dataset.tabsButton;

		if (button) {
			const currentLevel: HTMLElement | null = button.closest('.tabs');

			if (currentLevel) {
				this.buttons = currentLevel.querySelector('.tabs__buttons')!.querySelectorAll(':scope > .tabs__button');
				this.contents = currentLevel.querySelector('.tabs__body')!.querySelectorAll(':scope > .tabs__content');
			}

			this.buttons.forEach((item) => {
				item.classList.remove('js-tabs-button-active');
			});
			button.classList.add('js-tabs-button-active');
		} else {
			this.buttons.item(0)?.classList.add('js-tabs-button-active');
		}

		this.contents.forEach((item) => {
			const element = item as HTMLElement;

			if (element.dataset.tabsContent === currentContent) {
				element.classList.add('js-tabs-content-active');
			} else {
				element.classList.remove('js-tabs-content-active');
			}
		});
	}
}

export function Tabs(block?: HTMLElement) {
	const BLOCK_CLASS = '.tabs';
	const ELEMS: NodeListOf<HTMLElement> = block
		? block.querySelectorAll(BLOCK_CLASS)
		: document.querySelectorAll(BLOCK_CLASS);
	ELEMS.forEach((elem) => new TabsControl(elem, BLOCK_CLASS));
}
