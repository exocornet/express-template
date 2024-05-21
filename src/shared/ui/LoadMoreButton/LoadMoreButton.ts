// TODO Подумать над типом

type InitItemFunctionType = (list1: NodeListOf<any>) => NodeListOf<HTMLElement> | void;

type ResponseData = {
	itemsLayout: string;
	loadMoreButton: string;
};

/**
 * Класс для работы с кнопкой дозагрузки.
 * Вёрстка приходит с бэка и вставляется в указанный контейнер.
 * Работает с кнопкой и контейнером, которые находятся в одном блоке.
 * Необходимо повесить дата-атрибуты data-load-more-button и data-more-container на кнопку и контейнер соответственно.
 * Если кнопка в обёртке, то необходимо прокинуть параметр withWrapper
 */

export class LoadMoreButtonControl {
	private loadMoreButton: HTMLElement | null;
	private moreContainer: HTMLElement | null;
	private pagination: HTMLElement | null;
	private paginationLinks: NodeListOf<HTMLElement> | null;
	private apiLink: string | null;
	private withWrapper: boolean;
	private buttonWrapper: HTMLElement | null;
	private readonly initItemInFunction: InitItemFunctionType[] | null;
	private readonly initItemAfterFunction: InitItemFunctionType[] | null;
	private dataIdComponent: string | null;

	constructor(
		loadMoreButton: HTMLElement | null,
		moreContainer: HTMLElement | null,
		pagination: HTMLElement | null,
		withWrapper?: boolean,
		initItemInFunction?: InitItemFunctionType[],
		initItemAfterFunction?: InitItemFunctionType[],
		dataIdComponent?: string
	) {
		this.loadMoreButton = loadMoreButton;
		this.apiLink = this.loadMoreButton && this.loadMoreButton.getAttribute('href');
		this.moreContainer = moreContainer;
		this.pagination = pagination || null;
		this.paginationLinks = this.pagination?.querySelectorAll('.pagination__link') || null;
		this.withWrapper = withWrapper || false;
		this.buttonWrapper = this.withWrapper ? this.loadMoreButton && this.loadMoreButton.parentElement : null;
		this.initItemInFunction = initItemInFunction || null;
		this.initItemAfterFunction = initItemAfterFunction || null;
		this.dataIdComponent = dataIdComponent || null;

		this.#init();
	}

	#init() {
		this.#bindLoadButton();
		this.pagination && this.#bindPaginationLinks();
	}

	#apiFetch(itemURL?: string | null, controller?: string) {
		const URL = itemURL || `${this.apiLink}`;

		fetch(URL, {
			method: 'GET',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-Component': `${this.dataIdComponent}`,
			},
		})
			.then((data) => data.json())
			.then((response: ResponseData) => {
				if (this.moreContainer && this.loadMoreButton) {
					if (controller === 'pagination') {
						this.#prepareContainer(response.itemsLayout);
					} else if (controller === 'show-more') {
						this.#addNewElement(response.itemsLayout);
					}

					this.#removeButtonWrapper();
					if (response.loadMoreButton) {
						this.#reInitControl(response.loadMoreButton);
					}
				}
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error(err);
			});
	}

	#prepareContainer(layout: string) {
		if (this.moreContainer) {
			for (let i = 0; i < this.moreContainer.childNodes.length; i++) {
				if (
					this.moreContainer.childNodes[i] !== this.buttonWrapper &&
					this.moreContainer.childNodes[i] !== this.loadMoreButton
				) {
					this.moreContainer.childNodes[i].remove();
					i--;
				}
			}

			this.#addNewElement(layout);
		}
	}

	#addNewElement(layout: string) {
		let listOfItems: NodeListOf<HTMLElement> = this.#createListFromHtml(layout);

		this.initItemInFunction &&
			this.initItemInFunction.forEach((InitFunction: InitItemFunctionType) => {
				const newNodeList = InitFunction(listOfItems);
				listOfItems = newNodeList || listOfItems;
			});

		(this.moreContainer as HTMLElement).append(...listOfItems);

		this.initItemAfterFunction &&
			this.initItemAfterFunction.forEach((InitFunction: InitItemFunctionType) => {
				InitFunction(listOfItems);
			});
	}

	#reInitControl(control: string) {
		const newElement = this.#createElementFromHTML(control);

		if (this.withWrapper) {
			this.buttonWrapper = newElement;
			this.moreContainer?.append(this.buttonWrapper);
		} else {
			this.loadMoreButton?.replaceWith(newElement);
			this.loadMoreButton = newElement;
			this.moreContainer?.append(this.loadMoreButton);
		}

		if (this.buttonWrapper?.querySelector('[data-load-more-button]')) {
			this.loadMoreButton = this.buttonWrapper.querySelector('[data-load-more-button]');
			this.apiLink = this.loadMoreButton && this.loadMoreButton.getAttribute('href');
			this.#bindLoadButton();
		}

		if (this.buttonWrapper?.querySelector('.pagination')) {
			this.pagination = this.buttonWrapper.querySelector('.pagination');
			this.paginationLinks = this.pagination?.querySelectorAll('.pagination__link') || null;
			this.#bindPaginationLinks();
		}
	}

	#bindLoadButton() {
		this.loadMoreButton &&
			this.loadMoreButton.addEventListener('click', (e) => {
				e.preventDefault();

				if (this.loadMoreButton) {
					const pathname = this.loadMoreButton.getAttribute('href');
					pathname && history.replaceState({}, '', pathname);
				}

				this.#apiFetch(undefined, 'show-more');
			});
	}

	#bindPaginationLinks() {
		this.paginationLinks?.forEach((link) => {
			if (link.getAttribute('href')) {
				link.addEventListener('click', (e) => {
					e.preventDefault();

					const pathname = link.getAttribute('href');
					pathname && history.replaceState({}, '', pathname);

					this.#apiFetch(link.getAttribute('href'), 'pagination');
				});
			}
		});
	}

	#createElementFromHTML(html: string) {
		const div = document.createElement('div');
		div.innerHTML = html.trim();

		return div.firstChild as HTMLElement;
	}

	#createListFromHtml(html: string): NodeListOf<HTMLElement> {
		const parser = new DOMParser();
		const childrenResponse: HTMLElement = parser.parseFromString(html, 'text/html').body;

		//return Array.from(childrenResponse.querySelectorAll('body > *'));
		return childrenResponse.querySelectorAll('body > *');
	}

	#removeButtonWrapper() {
		if (this.withWrapper && this.buttonWrapper) {
			this.buttonWrapper?.remove();
		}
	}

	rebindButton(data: string) {
		this.#removeButtonWrapper();
		if (data) {
			this.#reInitControl(data);
		}
	}
}

/**
 * Функция для инициализации кнопки догрузки.
 */
export function InitLoadMoreButton(
	button: HTMLElement | null,
	moreContainer: HTMLElement | null,
	pagination: HTMLElement | null,
	withWrapper: boolean,
	initItemInFunction?: InitItemFunctionType[],
	initItemAfterFunction?: InitItemFunctionType[],
	dataComponentId?: string
) {
	return new LoadMoreButtonControl(
		button,
		moreContainer,
		pagination,
		withWrapper,
		initItemInFunction,
		initItemAfterFunction,
		dataComponentId
	);
}
