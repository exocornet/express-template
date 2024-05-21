import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';
import { ClassDebounce } from '../../shared/helpers/js/useDebounce';
import useTemplate from '../../shared/helpers/js/useTemplate';

class CatalogSearchControl {
	block: HTMLElement;
	classBlock: string;
	body: HTMLElement | null;

	elementForm: HTMLFormElement | null;
	elementBtnCatalog: HTMLElement | null;
	elementInputSearch: HTMLInputElement | null;
	elementBtnInput: HTMLButtonElement | null;
	elementInputSvgUse: SVGUseElement | null;
	elementResultSearch: HTMLElement | null;

	componentCatalog: HTMLElement | null;
	componentCart: HTMLElement | null;

	constructor(block: HTMLElement, classBlock: string) {
		this.block = block;
		this.classBlock = classBlock;
		this.body = document.querySelector('body');

		this.elementForm = this.block.querySelector(`${this.classBlock}__form`);
		this.elementBtnCatalog = this.block.querySelector(`${this.classBlock}__btn-catalog`);
		this.elementInputSearch = this.block.querySelector(`${this.classBlock}__input-search`);
		this.elementBtnInput = this.block.querySelector(`${this.classBlock}__btn-input`);
		this.elementInputSvgUse = this.block.querySelector(`${this.classBlock}__input-svg-use`);
		this.elementResultSearch = this.block.querySelector(`${this.classBlock}__result-search`);

		this.componentCatalog = document.querySelector('.catalog');
		this.componentCart = document.querySelector('.cart');

		this.#init();
	}

	#init() {
		this.#onClickBtnCatalog();
		this.#onChangeInputSearch();
		this.#viewSearchClear();
		this.#onClickSearchClear();
	}

	#onClickBtnCatalog() {
		this.elementBtnCatalog?.addEventListener('click', () => {
			this.componentCatalog?.classList.toggle('js-show-catalog');
			this.elementBtnCatalog?.classList.toggle('js-active-catalog');
			this.body?.classList.toggle('js-body-hidden-scrollbar');

			useMediaQuery(
				1280,
				() => {
					this.componentCart?.classList.toggle('d-none');
				},
				() => {}
			);
		});
	}

	#viewSearchClear() {
		const INPUT_SEARCH_VALUE = this.elementInputSearch?.value;

		if (INPUT_SEARCH_VALUE && INPUT_SEARCH_VALUE.length > 0) {
			this.elementInputSvgUse?.setAttribute('href', '#search-clear');
		} else {
			this.elementInputSvgUse?.setAttribute('href', '#search');
		}
	}

	#onClickSearchClear() {
		this.elementBtnInput?.addEventListener('click', () => {
			this.elementInputSearch && (this.elementInputSearch.value = '');
			this.elementResultSearch?.classList.remove('d-grid');
			this.elementResultSearch && (this.elementResultSearch.innerHTML = '');
			this.#viewSearchClear();
		});
	}

	#onChangeInputSearch() {
		const SEARCH_RESPONSE = () => {
			this.elementResultSearch?.classList.add('d-grid');
			this.#fetchApiResultSearch(
				`${this.elementForm?.dataset.urlApi}?${this.elementInputSearch?.name}=${this.elementInputSearch?.value}`
			);
		};

		const searchDebounce = new ClassDebounce<string>(SEARCH_RESPONSE);

		this.elementInputSearch?.addEventListener('input', (event) => {
			const CURRENT_TARGET = event.currentTarget as HTMLInputElement;
			const VALUE = CURRENT_TARGET.value;

			searchDebounce.clearTimer();

			if (VALUE.length > 2) {
				searchDebounce.setTimer();
			} else {
				this.elementResultSearch?.classList.remove('d-grid');
				this.elementResultSearch && (this.elementResultSearch.innerHTML = '');
			}

			this.#viewSearchClear();
		});

		this.elementInputSearch?.addEventListener('invalid', (e) => {
			e.preventDefault();
		});
	}

	#fetchApiResultSearch(url: string) {
		fetch(url, {
			method: 'GET',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
			},
		})
			.then((response) => response.json())
			.then((resultSearch: Array<string>) => {
				this.elementResultSearch && (this.elementResultSearch.innerHTML = '');

				resultSearch.forEach((item) => {
					const TEMPLATE_RESULT_SEARCH_ITEM = useTemplate('template-result-search-item', this.block);
					const RESULT_SEARCH_ITEM: HTMLElement | null = TEMPLATE_RESULT_SEARCH_ITEM.querySelector(
						`${this.classBlock}__result-search-item`
					);
					RESULT_SEARCH_ITEM?.addEventListener('click', (event) => {
						const CURRENT_TARGET = event.currentTarget as HTMLElement;
						this.elementInputSearch && (this.elementInputSearch.value = CURRENT_TARGET.textContent!);
						this.elementForm?.submit();
					});
					RESULT_SEARCH_ITEM && (RESULT_SEARCH_ITEM.innerHTML = item);
					this.elementResultSearch?.append(TEMPLATE_RESULT_SEARCH_ITEM);
				});
			});
	}
}

export function CatalogSearch() {
	const CLASS_BLOCK = '.catalog-search';
	const ELEMENT: HTMLElement | null = document.querySelector(`${CLASS_BLOCK}`);
	ELEMENT && new CatalogSearchControl(ELEMENT, CLASS_BLOCK);
}
