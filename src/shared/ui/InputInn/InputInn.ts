// 7716689955 - ООО "АИС МЕДИА ГРАФ"
// 7707083893 - СБЕР
import { useDebounce } from '../../helpers/js/useDebounce';

interface IItem {
	data: {
		inn: string;
		kpp: string;
		ogrn: string;
		address: {
			value: string;
		};
	};
	value: string;
}

export class InputInnControl {
	CLASS_MODAL: string;
	CLASS_MODAL_SHOW: string;
	CLASS_LIST_SHOW: string;
	CLASS_ITEM_ACTIVE: string;

	block: HTMLElement;
	blockClass: string;
	input: HTMLInputElement | null;
	list: HTMLInputElement | null;
	listWrapper: HTMLInputElement | null;
	dataUrl: string | null;
	fetchDataDebounced: (...args: never[]) => void;
	activeItem: Record<string, string> | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.CLASS_MODAL = 'modal';
		this.CLASS_MODAL_SHOW = 'js-show';
		this.CLASS_LIST_SHOW = 'js-show';
		this.CLASS_ITEM_ACTIVE = 'js-active';

		this.block = block;
		this.blockClass = blockClass;
		this.input = this.block.querySelector('.input__field');
		this.list = this.block.querySelector(`.${blockClass}__list`);
		this.listWrapper = this.block.querySelector(`.${blockClass}__list-wrapper`);
		this.dataUrl = this.block.getAttribute('data-url');
		this.fetchDataDebounced = useDebounce(this.#fetchData.bind(this), 250);
		this.activeItem = null;
		this.#init();
	}

	get getActiveItemData() {
		return this.activeItem;
	}

	#init() {
		this.#initInput();
		this.#initObserver();
	}

	#initInput() {
		if (!this.dataUrl) return;
		this.input?.addEventListener('input', () => this.fetchDataDebounced());
		this.input?.addEventListener('focus', () => this.#showList());
		this.input?.addEventListener('blur', () => setTimeout(() => this.#hideList(), 300));
	}

	#initObserver() {
		const modal = this.block.closest(`.${this.CLASS_MODAL}`);
		if (!modal) return;

		const observer = new MutationObserver(() => !modal.classList.contains(this.CLASS_MODAL_SHOW) && this.#clearList());
		observer.observe(modal, { attributes: true });
	}

	#fetchData() {
		if (!this.dataUrl || !this.input) return;

		if (this.input.value.length >= 10) {
			fetch(this.dataUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': 'Token d8e6ab976e2b4b0cfa6d23ff731928e773f758c5',
				},
				body: JSON.stringify({ query: this.input?.value }),
			})
				.then((response) => response.json())
				.then((res) => {
					this.#createList(res.suggestions);
				});
		} else {
			this.#clearList();
		}
	}

	#createList(items: IItem[]) {
		this.#clearList();
		if (!items.length) return;

		[...items].map((item: IItem) => {
			const {
				data: {
					inn,
					kpp,
					ogrn,
					address: { value: addressValue },
				},
				value: name,
			} = item;

			const innItem = document.createElement('div');
			innItem.classList.add(`${this.blockClass}__item`);
			this.#isActiveItem(item.data) && innItem.classList.add(this.CLASS_ITEM_ACTIVE);

			innItem.innerHTML = `
				<span class="text text_body-m-m">${name}</span>
				<div class="text text_caption text_gray input-inn__item-info">
					<div class="input-inn__item-digits">
						<span>ИНН: ${inn}</span>
						<span>КПП: ${kpp}</span>
						<span>ОГРН: ${ogrn}</span>
					</div>
					<span>Юр. адрес: ${addressValue}</span>
				</div>`;

			innItem.addEventListener('click', () => {
				this.#setActiveItem(innItem, item);
				this.#hideList();
			});

			this.listWrapper?.append(innItem);
		});
		this.list?.classList.add(this.CLASS_LIST_SHOW);
	}

	#setActiveItem(itemElement: HTMLElement, item: IItem) {
		const {
			data: { inn, kpp, ogrn },
			value: name,
		} = item;
		this.input && (this.input.value = `${inn} • ${name}`);

		this.activeItem = { inn, kpp, ogrn, name };

		const items = this.listWrapper?.querySelectorAll(`.${this.blockClass}__item`);
		items &&
			items.forEach((child) => {
				child.classList.remove(this.CLASS_ITEM_ACTIVE);
			});
		itemElement.classList.add(this.CLASS_ITEM_ACTIVE);
	}

	#showList() {
		if (this.input && this.input.value.length >= 10) {
			this.listWrapper?.children.length && this.list?.classList.add(this.CLASS_LIST_SHOW);
		} else {
			this.#clearList();
		}
	}

	#hideList() {
		this.list?.classList.remove(this.CLASS_LIST_SHOW);
	}

	#clearList() {
		this.#hideList();
		this.listWrapper && (this.listWrapper.innerHTML = '');
		this.activeItem = null;
	}

	#isActiveItem({ inn, kpp }: { inn: string; kpp: string }) {
		if (!this.activeItem) return;
		return inn === this.activeItem.inn && kpp === this.activeItem.kpp;
	}
}

export function InputInn(block: HTMLElement) {
	const BLOCK_CLASS = 'input-inn';

	const elements: NodeListOf<HTMLElement> = block.querySelectorAll(`.${BLOCK_CLASS}`);
	const INPUT_INN_ARRAY: InputInnControl[] = [];
	elements.forEach((element) => INPUT_INN_ARRAY.push(new InputInnControl(element, BLOCK_CLASS)));
	return INPUT_INN_ARRAY;
}
