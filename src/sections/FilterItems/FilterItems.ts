import { InitLoadMoreButton, LoadMoreButtonControl } from '../../shared/ui/LoadMoreButton/LoadMoreButton';
import { SortSelect, SortSelectControl } from '../../components/SortSelect/SortSelect';
import { CardProduct, InitNewCardProduct } from '../../components/CardProduct/CardProduct';
import useTemplate from '../../shared/helpers/js/useTemplate';
import { IModalProduct } from '../ModalProduct/ModalProduct';
import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

type CheckboxType = HTMLInputElement | null | undefined;

class FilterControl {
	block: HTMLElement;
	elementBreadCrumbsHeading: HTMLElement | null;
	elementChipsWrapper: HTMLElement | null;
	elementBtnChipsTags: HTMLElement | null;
	elementFilterContent: HTMLElement | null;
	elementBtnClear: HTMLElement | null;
	elementTagsWrapper: HTMLElement | null;
	form: HTMLFormElement | null;
	formData: FormData;
	dataIdComponent: string;
	elementBtnText: Element | null | undefined;
	chipsTagsList: NodeListOf<HTMLElement> | undefined;
	sortSelectList: NodeListOf<HTMLElement> | null;
	checkboxList: NodeListOf<HTMLInputElement> | undefined;
	inputs: NodeListOf<HTMLInputElement> | undefined;
	hiddenTags: HTMLElement[] | NodeListOf<HTMLElement>;
	instanceSortSelect: SortSelectControl | undefined;
	isOpenBtnChipsTags: boolean;
	url: URL;
	loadMoreButtonControl: LoadMoreButtonControl | undefined;

	body: HTMLElement | null;
	filter: HTMLElement | null;
	filterButton: HTMLElement | null;
	closeFilterButton: HTMLElement | null;
	filterFooterClearButton: HTMLElement | null;
	filterFooterShowButton: HTMLElement | null;
	sortBackground: HTMLElement | null;
	sortWrapper: HTMLElement | null;
	sortButton: HTMLElement | null;
	closeSortButton: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.elementBreadCrumbsHeading = this.block.querySelector(`${blockClass}__bread-crumbs-heading`);
		this.elementChipsWrapper = this.block.querySelector(`${blockClass}__chips-wrapper`);
		this.elementBtnClear = this.block.querySelector(`${blockClass}__btn-clear`);
		this.elementBtnChipsTags = this.block.querySelector(`${blockClass}__btn-chips-tags`);
		this.elementTagsWrapper = this.block.querySelector(`${blockClass}__tags-wrapper`);
		this.elementFilterContent = this.block.querySelector(`${blockClass}__filter-content`);
		this.dataIdComponent = this.block.dataset.idComponent || '';
		this.form = document.querySelector('.filters__filter-form');
		this.inputs = this.form?.querySelectorAll('input');
		this.url = new URL(this.form?.action || window.location.href);
		this.chipsTagsList = this.elementTagsWrapper?.querySelectorAll('.chips__tag');
		this.elementBtnText = this.elementBtnChipsTags?.firstElementChild;
		this.sortSelectList = this.block.querySelectorAll('.sort-select__item');
		this.checkboxList = this.form?.querySelectorAll('.checkbox__input');

		//TODO ПОПРОБОВАТЬ РАЗДЕЛЯЮЩИЙ ФАЙЛ | ПОПРОБОВАТЬ СДЕЛАТЬ СОБЫТИЕ(может нарушиться порядок)
		const modalProduct = (document.querySelector('[data-modal="product"]') as IModalProduct).modalProduct;
		const AddModalProductControlButton = modalProduct.addModalProductOpenButton.bind(modalProduct);
		this.loadMoreButtonControl = InitLoadMoreButton(
			this.block.querySelector('[data-load-more-button]'),
			this.block.querySelector('[data-more-container]'),
			this.block.querySelector('.pagination'),
			true,
			[InitNewCardProduct, AddModalProductControlButton],
			[
				/*addActivateButton*/
			],
			this.dataIdComponent
		);
		this.isOpenBtnChipsTags = false;

		//TODO REFACTOR
		this.body = document.querySelector('body');
		this.filter = document.querySelector('.filters');
		this.filterButton = this.block.querySelector(`${blockClass}__filter-btn`);
		this.closeFilterButton = this.filter?.querySelector('.filters__close-button') || null;
		this.filterFooterClearButton = this.filter?.querySelector('.filters__footer-clear-button') || null;
		this.filterFooterShowButton = this.filter?.querySelector('.filters__footer-show-button') || null;

		this.sortBackground = this.block.querySelector(`${blockClass}__sort-wrapper-background`);
		this.sortWrapper = this.block?.querySelector(`${blockClass}__sort-wrapper`);
		this.sortButton = this.block.querySelector(`${blockClass}__sort-btn`);
		this.closeSortButton = this.block.querySelector('.sort-select__close-button');

		this.instanceSortSelect = SortSelect();
		this.#init();
	}

	#init() {
		CardProduct(this.block);

		this.#collectionFilterHandlers();
		this.#initCreateTags(true);
		this.#checkToShowBtnClear();
		this.#hideChipsTags(true);
		this.#onClickBtnChipsTags();
		this.#onClickBtnClear(this.elementBtnClear);
		//TODO REFACTOR. CREATE NORMAL INIT
		useMediaQuery(1280, this.#initMobile.bind(this), () => {});
	}

	#initMobile() {
		this.#onClickBtnClear(this.filterFooterClearButton);
		this.filterButton?.addEventListener('click', () => {
			this.#onShow(this.filter, 'js-filter-show');
		});
		this.closeFilterButton?.addEventListener('click', () => {
			this.#onHide(this.filter, 'js-filter-show');
		});
		this.filterFooterShowButton?.addEventListener('click', () => {
			this.#onHide(this.filter, 'js-filter-show');
		});

		this.sortButton?.addEventListener('click', () => {
			this.#onShow(this.sortWrapper, 'js-sort-show');
		});
		this.closeSortButton?.addEventListener('click', () => {
			this.#onHide(this.sortWrapper, 'js-sort-show');
		});
		this.sortBackground?.addEventListener('click', () => {
			this.#onHide(this.sortWrapper, 'js-sort-show');
		});
	}

	#onHide = (element: HTMLElement | null, controlClass: string) => {
		element && element.classList.remove(controlClass);
		this.body?.classList.remove('overflow-hidden');
	};

	#onShow = (element: HTMLElement | null, controlClass: string) => {
		element && element.classList.add(controlClass);
		this.body?.classList.add('overflow-hidden');
	};

	#fetchData(url: string) {
		// формирую строку параметров и обрабатываю запрос
		let urlFetch = new URL(window.location.href).pathname;
		url && (urlFetch = `${url}`);
		window.history.pushState({}, '', urlFetch);
		fetch(url, {
			method: 'GET',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-Component': this.dataIdComponent,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (this.elementFilterContent && data) {
					this.filterFooterShowButton &&
						(this.filterFooterShowButton.textContent = `Показать ${data.productCount} товаров`);

					data.heading && this.elementBreadCrumbsHeading && (this.elementBreadCrumbsHeading.innerHTML = data.heading);
					data.chips && this.elementChipsWrapper && (this.elementChipsWrapper.innerHTML = data.chips);

					this.elementFilterContent.innerHTML = data.itemsLayout;
					if (this.loadMoreButtonControl && data.loadMoreButton) {
						this.loadMoreButtonControl.rebindButton(data.loadMoreButton);
					}
				}
			});
	}

	#handlerSubmit = (url: URL, checkbox?: HTMLInputElement) => {
		// обработчик сабмита фильтра и сборка формдаты
		if (this.form) {
			this.formData = new FormData(this.form);
			this.formData.append('sort', this.instanceSortSelect?.getActiveAttribute() || '');
			const convertedFormEntries = Array.from(this.formData, ([key, value]) => [
				key,
				typeof value === 'string' ? value : value.name,
			]);
			const queryString = new URLSearchParams(convertedFormEntries);
			url.search = queryString.toString();
			this.#fetchData(url.href);
		}
		if (checkbox?.hasAttribute('data-js-value')) {
			const checkboxText = checkbox?.getAttribute('data-js-value');
			const checkboxParentName = checkbox.closest('div[data-filter-name]')?.getAttribute('data-filter-name');
			if (checkbox?.checked) {
				this.#createChipsTags(checkboxParentName, checkboxText, checkbox.value);
			} else {
				this.#removeChipsTags(checkbox.value);
			}
			this.#checkToShowBtnClear();
			this.#checkToShowBtnChipsTags();
			this.#hideChipsTags();
		}
	};

	#collectionFilterHandlers() {
		// собираю все виды элементов на отправку
		this.#collectInputs();
		this.#collectSort();
	}

	#collectInputs() {
		// собираю все инпуты на отправку
		this.inputs?.forEach((input) => {
			input.addEventListener('input', () => this.#handlerSubmit(this.url, input));
		});
	}

	#collectSort() {
		// собираю всю сортировку на отправку
		this.sortSelectList?.forEach((item) => {
			item.addEventListener('click', () => this.#handlerSubmit(this.url));
		});
	}

	#hideChipsTags(init?: boolean) {
		// скрываю остальные теги в блоке кроме первых пяти
		this.chipsTagsList = this.block.querySelectorAll('.chips-tag');

		const collectHiddenTags = () => {
			this.hiddenTags = Array.from(this.chipsTagsList as NodeListOf<HTMLElement>).slice(5);
			this.hiddenTags.forEach((item) => item.classList.add('d-none'));
			this.#writeBtnText(`Все (${this.hiddenTags.length})`);
		};

		if (init) {
			if (this.chipsTagsList && this.chipsTagsList.length > 5) {
				collectHiddenTags();
				this.#checkToShowBtnChipsTags();
			}
		} else {
			if (!this.isOpenBtnChipsTags && this.chipsTagsList && this.chipsTagsList.length > 5) {
				this.#initCreateTags();
				this.chipsTagsList = this.block.querySelectorAll('.chips-tag');
				collectHiddenTags();
			} else {
				if (this.hiddenTags) {
					this.hiddenTags.forEach((item) => item.classList.remove('d-none'));
					this.#writeBtnText('Скрыть');
				}
			}
		}
	}

	#writeBtnText(text: string) {
		// корректирую текст кнопки в завимости от тегов
		if (this.elementBtnText !== null && this.elementBtnText !== undefined) {
			this.elementBtnText.textContent = text;
		}
	}

	#checkToShowBtnChipsTags() {
		// показываю или скрываю кнопку "Все"
		this.chipsTagsList = this.block.querySelectorAll('.chips-tag');

		if (this.chipsTagsList && this.chipsTagsList.length > 5) {
			this.elementBtnChipsTags?.classList.remove('d-none');
		} else {
			this.elementBtnChipsTags?.classList.add('d-none');
		}
	}

	#checkToShowBtnClear() {
		// показываю или скрываю кнопку очистки всех тегов
		this.chipsTagsList = this.block.querySelectorAll('.chips-tag');

		if (this.chipsTagsList && this.chipsTagsList.length) {
			this.elementBtnClear?.classList.remove('d-none');
		} else {
			this.elementBtnClear?.classList.add('d-none');
		}
	}

	#onClickBtnClear(element: HTMLElement | null) {
		// очищаю все теги и чекбоксы
		element?.addEventListener('click', () => {
			this.chipsTagsList = this.block.querySelectorAll('.chips-tag');
			this.chipsTagsList.forEach((item) => item.remove());
			this.checkboxList?.forEach((checkbox: HTMLInputElement) => {
				checkbox.checked = false;
			});
			this.#checkToShowBtnClear();
			this.#checkToShowBtnChipsTags();
			this.#hideChipsTags();
			this.#handlerSubmit(this.url);
		});
	}

	#onClickBtnChipsTags() {
		// показываю или скрываю все чипс-теги
		this.elementBtnChipsTags?.addEventListener('click', () => {
			this.elementBtnChipsTags?.classList.toggle('js-show-all-tags');
			this.isOpenBtnChipsTags = !!this.elementBtnChipsTags?.classList.contains('js-show-all-tags');
			this.#hideChipsTags();
		});
	}

	#initCreateTags(init?: boolean) {
		this.chipsTagsList = this.block.querySelectorAll('.chips-tag');
		const createTags = () => {
			this.checkboxList?.forEach((checkbox: HTMLInputElement) => {
				if (checkbox.checked) {
					const checkboxText = checkbox?.getAttribute('data-js-value');
					const checkboxParentName = checkbox.closest('div[data-filter-name]')?.getAttribute('data-filter-name');
					this.#createChipsTags(checkboxParentName, checkboxText, checkbox.value);
				}
			});
		};

		if (init) {
			createTags();
		} else {
			this.chipsTagsList.forEach((item) => {
				item.remove();
			});
			createTags();
		}
	}

	#createChipsTags(parentName: string | null | undefined, text: string | null, value: string) {
		// добавляю чипс-тег по клику на чекбокс
		if (parentName !== null && parentName !== undefined) {
			const templateChipsTag = useTemplate('template-chips-tag', this.block);
			const blockElem = templateChipsTag.querySelector('.chips-tag');
			const textElem = templateChipsTag?.querySelector('.text');

			if (blockElem && textElem) {
				blockElem.setAttribute('data-chips-tag', value);
				textElem.textContent = `${parentName}: ${text}`;
				blockElem.addEventListener('click', this.#onClickChipsTags);
			}

			this.elementTagsWrapper?.prepend(templateChipsTag);
		}
	}

	#onClickChipsTags = (e: Event) => {
		const currentAttribute = (e.currentTarget as HTMLElement)?.getAttribute('data-chips-tag');
		if (currentAttribute !== null) {
			this.#removeChipsTags(currentAttribute, true);
		}
		this.#checkToShowBtnClear();
	};

	#removeChipsTags(attributeValue: string, onClickChips?: boolean) {
		const checkbox: CheckboxType = this.form?.querySelector(`[value=${attributeValue}]`);
		const chipsTag: HTMLElement | null = this.block.querySelector(`[data-chips-tag=${attributeValue}]`);

		if (checkbox !== null && checkbox !== undefined) {
			checkbox.checked = false;
			chipsTag?.remove();
			this.#hideChipsTags();
			this.#checkToShowBtnChipsTags();
			if (onClickChips) {
				this.#handlerSubmit(this.url);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.filter-items';
	const element: HTMLElement | null = document.querySelector(`${blockClass}`);
	element && new FilterControl(element, blockClass);
});
