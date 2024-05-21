class SortSelectControl {
	block: HTMLElement;
	elementBody: HTMLElement | null;
	elementList: HTMLElement | null;
	elementItems: NodeListOf<HTMLElement> | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.elementBody = this.block.querySelector(`${blockClass}__body`);
		this.elementList = this.block.querySelector(`${blockClass}__list`);
		this.elementItems = this.block.querySelectorAll(`${blockClass}__item`);
		// вызов метода инициализации класса
		this.#init();
	}

	#init() {
		this.#onOpen();
		this.#onClickItem();
		this.#onClickOutside();
		this.#setInitialActive();
	}

	#onOpen() {
		this.elementBody?.addEventListener('click', () => {
			this.block.classList.toggle('js-sort-select-show');
		});
	}

	getActiveAttribute(): string {
		let currentSort = '';
		this.elementItems?.forEach((item) => {
			if (item.classList.contains('js-active')) {
				currentSort = item.getAttribute('data-sort') || '';
			}
		});
		return currentSort;
	}

	#setInitialActive() {
		const urlParams = new URLSearchParams(window.location.search);
		const sortNow = urlParams.get('sort');

		if (sortNow) {
			this.elementItems?.forEach((item) => {
				if (item.getAttribute('data-sort') === sortNow) {
					item.classList.add('js-active');
					if (this.elementBody && this.elementBody.firstElementChild) {
						item && (this.elementBody.firstElementChild.textContent = item.textContent);
					}
				}
			});
		} else {
			this.elementItems && this.elementItems[0] && this.elementItems[0].classList.add('js-active');
			if (this.elementBody && this.elementBody.firstElementChild) {
				this.elementItems &&
					this.elementItems[0] &&
					(this.elementBody.firstElementChild.textContent = this.elementItems[0].textContent);
			}
		}
	}

	#onClickOutside() {
		document.addEventListener('click', (e) => {
			const withinBoundaries = e.composedPath().includes(this.block);

			if (!withinBoundaries) {
				this.block.classList.remove('js-sort-select-show');
			}
		});
	}

	#onClickItem() {
		this.elementItems?.forEach((item) => {
			item.addEventListener('click', (e) => {
				const target = e.currentTarget as HTMLElement;
				const text = target.textContent;
				this.elementList?.querySelectorAll('.js-active').forEach((item) => {
					item.classList.remove('js-active');
				});
				target.classList.add('js-active');
				if (this.elementBody && this.elementBody.firstElementChild) {
					this.elementBody.firstElementChild.textContent = text;
				}
				this.block.classList.remove('js-sort-select-show');
			});
		});
	}
}

function SortSelectArr(): SortSelectControl[] {
	const blockClass: string = '.sort-select';
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`${blockClass}`);
	const instance: SortSelectControl[] = [];
	elements.forEach((element) => {
		element && instance.push(new SortSelectControl(element, blockClass));
	});
	return instance;
}

function SortSelect(): SortSelectControl | undefined {
	const blockClass: string = '.sort-select';
	const element: HTMLElement | null = document.querySelector(`${blockClass}`);

	if (element) {
		return new SortSelectControl(element, blockClass);
	}
}

export { SortSelectArr, SortSelect, SortSelectControl };
