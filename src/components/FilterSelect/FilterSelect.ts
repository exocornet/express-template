import { Input } from '../../shared/ui';

class FilterSelect {
	block: HTMLElement;
	elementBody: HTMLElement | null;
	elementList: HTMLElement | null;
	searchInput: HTMLElement | null;
	btnShowMore: HTMLElement | null;
	searchInputIconClose: HTMLElement | null | undefined;
	searchInputField: HTMLElement | null | undefined;
	elementItems: NodeListOf<HTMLElement> | null;
	elementCheckboxes: NodeListOf<HTMLElement> | null;
	hiddenCheckboxes: HTMLElement[] | null;
	hasHiddenCheckboxes: boolean;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.elementBody = this.block.querySelector(`${blockClass}__body`);
		this.elementList = this.block.querySelector(`${blockClass}__list`);
		this.elementItems = this.block.querySelectorAll(`${blockClass}__item`);
		this.elementCheckboxes = this.block.querySelectorAll(`${blockClass}__checkbox`);
		this.btnShowMore = this.block.querySelector('.button-show-more');
		this.searchInput = this.block.querySelector('.input');
		this.searchInputField = this.searchInput?.querySelector('.input__field');
		this.searchInputIconClose = this.searchInput?.querySelector('.input__icon-close');
		this.hasHiddenCheckboxes = false;
		// вызов метода инициализации класса
		this.#init();
	}

	#init() {
		Input(this.block);
		this.#onToggle();
		this.#isHideBtnShowMore();
		this.#hideMoreCheckboxes();
		this.#onClickBtnShowMore();
		this.#onSearchCheckboxes();
		this.#onClearSearchInput();
	}

	#isHideBtnShowMore() {
		// скрыть кнопку если в нем меньше 6 элементов
		this.elementCheckboxes && this.elementCheckboxes.length < 6 && this.btnShowMore?.classList.add('d-none');
	}

	#hideMoreCheckboxes() {
		// скрыть остальные чекбоксы кроме первых пяти
		if (this.elementCheckboxes && this.elementCheckboxes?.length > 5) {
			this.hiddenCheckboxes = Array.from(this.elementCheckboxes).slice(5);
			this.hiddenCheckboxes.forEach((item) => item.classList.add('d-none'));
			this.hasHiddenCheckboxes = true;
		}
	}

	#onClearSearchInput() {
		// обработчик кнопки очистки поиска
		this.searchInputIconClose?.addEventListener('click', () => {
			this.btnShowMore?.classList.remove('d-none');
			this.elementCheckboxes?.forEach((item) => {
				item.classList.remove('d-none');
			});
		});
	}

	#onSearchCheckboxes() {
		// обработчик поиска чекбоксов
		this.searchInputField?.addEventListener('input', (e) => {
			this.btnShowMore?.classList.add('d-none');
			this.elementCheckboxes?.forEach((item) => {
				if (item.textContent?.toLowerCase().includes((this.searchInputField as HTMLInputElement).value.toLowerCase())) {
					item.classList.remove('d-none');
				} else {
					item.classList.add('d-none');
				}
			});
			(e.target as HTMLInputElement).value === ''
				? this.btnShowMore?.classList.remove('d-none')
				: this.btnShowMore?.classList.add('d-none');
		});
	}

	#showMoreCheckboxes() {
		// показать все чекбоксы
		this.elementCheckboxes?.forEach((item) => item.classList.remove('d-none'));
		this.hasHiddenCheckboxes = false;
	}

	#onClickBtnShowMore() {
		// обработчик тогглера кнопки
		this.btnShowMore?.addEventListener('click', () => {
			if (this.hasHiddenCheckboxes) {
				this.block.classList.add('js-filter-all-checkboxes-show');
				this.#showMoreCheckboxes();
				this.searchInput?.classList.remove('d-none');
				this.searchInputField?.focus();
			} else {
				this.block.classList.remove('js-filter-all-checkboxes-show');
				this.#hideMoreCheckboxes();
				this.searchInput?.classList.add('d-none');
			}
		});
	}

	#onToggle() {
		// обработчик тогглера самого блока
		this.elementBody?.addEventListener('click', () => {
			this.block.classList.toggle('js-filter-select-show');
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.filter-select';
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		element && new FilterSelect(element, blockClass);
	});
});
