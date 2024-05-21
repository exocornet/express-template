import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

class TotalCheckAmountControl {
	block: HTMLElement;
	orderDetailedSection: HTMLElement | null;
	totalCheckAmountParentBlock: ParentNode | null | undefined;

	constructor(block: HTMLElement) {
		this.block = block;
		this.orderDetailedSection = document.querySelector('.order-detailed');
		this.totalCheckAmountParentBlock = this.block.parentNode;

		this.#init();
	}

	#init() {
		if (window.innerWidth < 1280) {
			this.block && this.orderDetailedSection?.after(this.block);
		}
		this.#changeTotalCheckPosition();
	}

	#changeTotalCheckPosition() {
		useMediaQuery(
			1280,
			() => {
				this.orderDetailedSection?.after(this.block);
			},
			() => {
				this.totalCheckAmountParentBlock?.prepend(this.block);
			}
		);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass = '.total-check-amount';
	const element: HTMLElement | null = document.querySelector(blockClass);

	element && new TotalCheckAmountControl(element);
});
