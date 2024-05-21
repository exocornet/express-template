import { CardProduct } from '../../components/CardProduct/CardProduct';

class LikeControl {
	block: HTMLElement;
	constructor(block: HTMLElement) {
		CardProduct(block);

		this.block = block;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.section-card-product-heading';
	const elements: NodeListOf<HTMLElement> | null = document.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		new LikeControl(element);
	});
});
