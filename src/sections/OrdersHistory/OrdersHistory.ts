import { InitLoadMoreButton, LoadMoreButtonControl } from '../../shared/ui/LoadMoreButton/LoadMoreButton';

class FilterControl {
	block: HTMLElement;
	dataIdComponent: string;
	loadMoreButtonControl: LoadMoreButtonControl | undefined;

	body: HTMLElement | null;
	filter: HTMLElement | null;
	constructor(block: HTMLElement) {
		this.block = block;
		this.dataIdComponent = this.block.getAttribute('data-id-component') || '';

		//TODO ПОПРОБОВАТЬ РАЗДЕЛЯЮЩИЙ ФАЙЛ | ПОПРОБОВАТЬ СДЕЛАТЬ СОБЫТИЕ(может нарушиться порядок)
		this.loadMoreButtonControl = InitLoadMoreButton(
			this.block.querySelector('[data-load-more-button]'),
			this.block.querySelector('[data-more-container]'),
			this.block.querySelector('.pagination'),
			true,
			[],
			[
				/*addActivateButton*/
			],
			this.dataIdComponent
		);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = 'orders-history';
	const element: HTMLElement | null = document.querySelector(`.${blockClass}`);

	element && new FilterControl(element);
});
