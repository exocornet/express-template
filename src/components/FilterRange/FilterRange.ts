/* eslint-disable */
// @ts-nocheck

import noUiSlider from 'nouislider';
import { Input } from '../../shared';
import { useDebounce } from '../../shared/helpers/js/useDebounce';

export class FilterRange {
	block: HTMLElement;
	blockClass: string;
	elementBody: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.blockClass = blockClass;

		this.elementBody = this.block.querySelector(`${this.blockClass}__body`);
		// вызов метода инициализации класса
		this.#init();
	}

	#init() {
		Input(this.block);
		this.#onToggle();
		this.#initRangeSlider();
	}

	#triggerChangeEvent(inputElement) {
		const event = new Event('input');
		inputElement.dispatchEvent(event);
	}

	#initRangeSlider() {
		const rangeSlider = this.block.querySelector(`${this.blockClass}__range-slider`);
		const inputStart = this.block.querySelector('[data-input-name="inputFrom"]');
		const inputEnd = this.block.querySelector('[data-input-name="inputTo"]');
		const min = inputStart?.getAttribute('min');
		const max = inputStart?.getAttribute('max');
		const inputs = [inputStart, inputEnd];
		const debounceTriggerChange = useDebounce(this.#triggerChangeEvent, 500);

		noUiSlider.create(rangeSlider, {
			start: [Number(min), Number(max)],
			connect: true,
			step: 1,
			range: {
				min: Number(min),
				max: Number(max),
			},
		});

		rangeSlider?.noUiSlider.on('update', (values, handle) => {
			inputs[handle].value = Math.round(values[handle]);
		});

		rangeSlider.noUiSlider.on('end', (values, handle) => {
			inputs[handle].value = Math.round(values[handle]);
			debounceTriggerChange(inputs[handle]);
		});

		const setRangeSlider = (i: number, value: string) => {
			const arr = [null, null];
			arr[i] = value;
			rangeSlider?.noUiSlider.set(arr);
		};

		inputs.forEach((input, idx) => {
			input?.addEventListener('change', (e) => {
				setRangeSlider(idx, e.currentTarget?.value);
			});

			input?.addEventListener('keyup', (e) => {
				setRangeSlider(idx, e.currentTarget?.value);
			});
		});
	}

	#onToggle() {
		// обработчик тогглера самого блока
		this.elementBody?.addEventListener('click', () => {
			this.block.classList.toggle('js-filter-range-show');
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const blockClass: string = '.filter-range';
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`${blockClass}`);
	elements.forEach((element) => {
		element && new FilterRange(element, blockClass);
	});
});
