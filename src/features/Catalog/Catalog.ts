class CatalogController {
	block: HTMLElement;
	blockClass: string;
	elementCatalogItemArr: NodeListOf<Element> | undefined;
	elementCategoryList: NodeListOf<Element> | undefined;
	elementList: HTMLElement | null;
	isNotDesktop: boolean;
	elementCatalogContent: HTMLElement | null;
	templateCatalogContent: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.blockClass = blockClass;
		this.isNotDesktop = window.matchMedia('only screen and (max-width:  1280px)').matches;

		this.elementCatalogItemArr = this.block.querySelectorAll(`${this.blockClass}__catalog-item`);
		this.elementCategoryList = this.block.querySelectorAll(`${this.blockClass}__category-list`);

		this.#init();
	}

	#init() {
		this.#setActiveItem();
		this.#onClickCatalogItem();
		this.#setInitialActiveBlock();
		this.#copyInItem();
	}

	#copyInItem = () => {
		if (this.isNotDesktop) {
			this.elementCatalogItemArr?.forEach((item) => {
				const itemCatalogList = item.querySelector('.catalog-item__list');
				this.elementCategoryList?.forEach((itemBlock) => {
					if (item.getAttribute('data-category') === itemBlock.getAttribute('data-category-block')) {
						const titleItems = itemBlock.querySelectorAll('[data-catalog-title]');
						itemCatalogList?.append(...titleItems);
					}
				});
			});
		}
	};

	#onClickCatalogItem = () => {
		this.elementCatalogItemArr?.forEach((item) => {
			item.addEventListener('click', (e) => {
				if (this.isNotDesktop) {
					const currentTarget = e.currentTarget as HTMLElement;

					if (item.classList.contains('js-catalog-selected')) {
						currentTarget.classList.remove('js-catalog-selected');
					} else {
						this.elementCatalogItemArr?.forEach((item) => {
							item.classList.remove('js-catalog-selected');
						});
						item.classList.add('js-catalog-selected');
					}
				} else {
					item.classList.toggle('js-catalog-selected');
					this.elementCatalogItemArr?.forEach((item) => item.classList.remove('js-catalog-selected'));
					item.classList.add('js-catalog-selected');
					this.#setActiveBlock(item.getAttribute('data-category'));
				}
			});
		});
	};

	#setActiveItem = () => {
		if (!this.isNotDesktop) {
			if (this.elementCatalogItemArr && this.elementCatalogItemArr[0]) {
				this.elementCatalogItemArr[0].classList.add('js-catalog-selected');
			}
		}
	};

	#setActiveBlock = (attr: string | null) => {
		if (attr) {
			this.elementCategoryList?.forEach((item) => {
				item.classList.remove('js-active-block');
			});
		}
		this.block.querySelector(`[data-category-block="${attr}"]`)?.classList.add('js-active-block');
	};

	#setInitialActiveBlock = () => {
		this.elementCatalogItemArr?.forEach((item) => {
			if (item.classList.contains('js-catalog-selected')) {
				this.#setActiveBlock(item.getAttribute('data-category'));
			}
		});
	};
}

export function Catalog() {
	const blockClass: string = '.catalog';
	const elem: HTMLElement | null = document.querySelector(`${blockClass}`);
	if (elem) {
		new CatalogController(elem, blockClass);
	}
}
