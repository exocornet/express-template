import { ButtonShowMore } from '../ButtonShowMore/ButtonShowMore';

class HiddenTextControl extends ButtonShowMore {
	block: HTMLElement;
	hiddenText: HTMLElement | null;
	maxStrokeCount: number = 5;

	constructor(block: HTMLElement) {
		super(block.querySelector('.button-show-more') as HTMLElement);

		this.block = block;
		this.hiddenText = this.block.querySelector('[data-hidden-text]');

		this.#init();
	}

	#init() {
		this.hideText1();
		this.#bindHideButton();
	}

	#bindHideButton() {
		super.getButtonShowMore?.addEventListener('click', () => {
			this.hiddenText?.classList.toggle('js-hide-text');
		});
	}

	hideText1() {
		this.hiddenText?.classList.remove('js-hide-text');

		const divHeight = this.hiddenText?.offsetHeight;
		const lineHeight = this.hiddenText && parseFloat(getComputedStyle(this.hiddenText).lineHeight);
		const numberOfLines = divHeight && lineHeight ? Math.round(divHeight / lineHeight) : -1;

		if (numberOfLines > this.maxStrokeCount) {
			super.getButtonShowMore?.classList.remove('d-none');
			this.hiddenText?.classList.add('js-hide-text');
		} else {
			super.getButtonShowMore?.classList.add('d-none');
		}
	}
}

export function HiddenText(block: HTMLElement) {
	const blockClass: string = '.hidden-text';
	const elements: NodeListOf<HTMLElement> = block.querySelectorAll(`${blockClass}`);
	const HiddenTextArr: HiddenTextControl[] = [];
	elements.forEach((element) => {
		HiddenTextArr.push(new HiddenTextControl(element));
	});

	window.addEventListener('resize', () => {
		HiddenTextArr.forEach((HiddenText) => {
			HiddenText.hideText1();
		});
	});
}
