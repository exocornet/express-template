export class ButtonShowMore {
	block: HTMLElement;
	elementText: Element | null | undefined;
	hideText: string | null;
	originalText: string | null | undefined;

	constructor(block: HTMLElement, blockClass: string = '.button-show-more') {
		this.block = block;
		this.hideText = this.block.getAttribute('data-hide-text');
		this.elementText = this.block.querySelector(`${blockClass}__text`);
		this.originalText = this.elementText?.textContent;
		// вызов метода инициализации класса
		this.#init();
	}

	get getButtonShowMore() {
		return this.block;
	}

	#init() {
		this.#onToggle();
	}

	#onToggle() {
		this.block?.addEventListener('click', () => {
			this.block.classList.toggle('js-button-show-more-opened');
			this.#renameBtnText();
		});
	}

	#renameBtnText() {
		if (this.elementText) {
			if (typeof this.originalText === 'string') {
				this.block?.classList.contains('js-button-show-more-opened')
					? (this.elementText.textContent = this.hideText)
					: (this.elementText.textContent = this.originalText);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.button-show-more';
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		element && new ButtonShowMore(element, blockClass);
	});
});
