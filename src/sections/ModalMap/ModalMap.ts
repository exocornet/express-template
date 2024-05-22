import { Input, InputControl, ModalControl } from '../../shared/ui';
import { MapControl, Map } from '../../components/Map/Map';
import { useDebounce } from '../../shared/helpers/js/useDebounce';
import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

class ModalMapControl extends ModalControl {
	block: HTMLElement;
	modal: ModalControl;
	modalBody: HTMLElement | null;
	modalMap: MapControl | null;
	modalInput: HTMLElement | null;
	modalSuggestResult: HTMLElement | null;
	inputInstance: InputControl | null;
	modalApplyButton: HTMLElement | null;
	modalSearchContainer: HTMLElement | null;
	modalButtonBack: HTMLElement | null;

	constructor(block: HTMLElement, blockClass: string) {
		super(block);

		this.block = block;
		this.modalBody = this.block.querySelector('.modal__body');
		this.modalInput = this.block.querySelector(`${blockClass}__input`);
		this.modalSuggestResult = this.modalInput && this.modalInput.querySelector(`${blockClass}__suggest-result`);
		this.inputInstance = Input(this.block);
		this.modalApplyButton = this.block.querySelector(`${blockClass}__apply-button`);
		this.modalSearchContainer = this.block.querySelector(`${blockClass}__search`);
		this.modalButtonBack = this.block.querySelector(`${blockClass}__button-back`);

		this.modalMap = Map(this.block);

		this.#init();
	}

	#init() {
		this.#bindModalMapClose();
		this.#bindInput();
		this.#addMapListener();
		this.#addMobile();
	}

	#bindModalMapClose() {
		super.getCloseButton?.addEventListener('click', () => {
			this.#closeHandler();
		});
		super.getBackground?.addEventListener('click', () => {
			this.#closeHandler();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key == this.KEY_ESC) {
				this.#closeHandler();
			}
		});
	}

	#closeHandler() {
		this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');
		this.inputInstance?.reset();
	}

	#bindInput() {
		if (!this.inputInstance) return;

		const debouncedFunc = useDebounce(async () => {
			if (!this.inputInstance) return;

			const suggestPlaces = await this.modalMap?.suggestPlace(this.inputInstance.getInput.value);
			suggestPlaces?.forEach((suggestPlace) => {
				const suggestPlaceDiv = document.createElement('div');
				suggestPlaceDiv.classList.add('modal-map__suggest-place');
				suggestPlaceDiv.textContent = suggestPlace;
				suggestPlaceDiv.addEventListener('click', async () => {
					if (!suggestPlaceDiv.textContent || !this.inputInstance) return;
					this.inputInstance.setValue(suggestPlaceDiv.textContent);

					const place = await this.modalMap?.findPlace(suggestPlaceDiv.textContent);
					const coordinates = place && place[0].geometry?.coordinates;
					if (coordinates) {
						this.modalMap?.setLocation(coordinates, 16);
						this.modalMap?.setMarkerLocation(coordinates);
					}
					this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');
				});

				this.modalSuggestResult?.append(suggestPlaceDiv);
			});
		}, 250);

		this.inputInstance.getInput.addEventListener('input', () => {
			if (this.inputInstance!.getInput.value.length > 2) {
				this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');

				debouncedFunc();
			} else {
				this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');
			}
		});

		this.inputInstance.getCloseButton?.addEventListener('click', () => {
			this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');
		});
	}

	#addMapListener() {
		this.modalMap?.addObserver(this);
	}

	#addMobile() {
		useMediaQuery(
			768,
			() => {
				this.modalInput?.addEventListener('click', () => {
					this.modalSearchContainer?.classList.add('modal-map__search-active');
				});
				this.modalButtonBack?.addEventListener('click', () => {
					this.modalSuggestResult && (this.modalSuggestResult.innerHTML = '');
					this.modalSearchContainer?.classList.remove('modal-map__search-active');
				});
			},
			() => {}
		);
	}

	update(place: string) {
		this.inputInstance && this.inputInstance.setValue(place);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const BLOCK_CLASS = '.modal-map';

	const element: HTMLElement | null = document.querySelector(`${BLOCK_CLASS}`);

	element && new ModalMapControl(element, BLOCK_CLASS);
});
