// class SearchControl {
// 	block: HTMLElement;
// 	elementWrapper: HTMLElement | null;
//
// 	constructor(block: HTMLElement, blockClass: string) {
// 		this.block = block;
// 		this.elementWrapper = this.block.querySelector(`.${blockClass}__wrapper`);
//
// 		// вызов метода инициализации класса
// 		this.#init();
// 	}
//
// 	#init() {
// 		// empty
// 	}
// }
//
// document.addEventListener('DOMContentLoaded', () => {
// 	const blockClass: string = 'search';
// 	const element: HTMLElement | null = document.querySelector(`.${blockClass}`);
// 	element && new SearchControl(element, blockClass);
// });
