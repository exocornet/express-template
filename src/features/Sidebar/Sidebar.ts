class SidebarControl {
	block: HTMLElement;
	items: NodeListOf<HTMLElement> | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.items = this.block.querySelectorAll(`.item-${blockClass}`);

		// вызов метода инициализации класса
		this.#init();
	}

	#init() {
		this.#clickHandler();
	}

	#clickHandler() {
		this.items?.forEach((item) => {
			item.addEventListener('click', (e) => {
				const target = e.target as HTMLElement;
				const isContainsList = target.classList.contains('item-sidebar__list');
				const isContainsLink = target.classList.contains('item-sidebar__link');

				if (item.classList.contains('js-show') && !isContainsList && !isContainsLink) {
					(e.currentTarget as HTMLElement).classList.remove('js-show');
				} else {
					this.items?.forEach((item) => {
						item.classList.remove('js-show');
					});
					item.classList.add('js-show');
				}
			});
		});
	}
}

export function Sidebar() {
	const elem = document.querySelector('.sidebar') as HTMLElement;
	if (elem) {
		new SidebarControl(elem, 'sidebar');
	}
}
